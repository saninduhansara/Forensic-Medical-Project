import { createContext, useContext, useState, useEffect } from "react";
import type { AppUser, Patient, MLEFForm, MLRReport, LabRequest, PMRForm } from "@/types";
import { api } from "@/lib/api";

interface AppContextType {
  currentUser: AppUser | null;
  setCurrentUser: (u: AppUser | null) => void;
  users: AppUser[];
  addUser: (u: AppUser) => void;
  patients: Patient[];
  addPatient: (p: Patient) => void;
  mlefForms: MLEFForm[];
  saveMlefForm: (f: MLEFForm) => void;
  mlrReports: MLRReport[];
  saveMlrReport: (r: MLRReport) => void;
  labRequests: LabRequest[];
  addLabRequest: (r: LabRequest) => void;
  updateLabRequest: (id: string, data: Partial<LabRequest>) => void;
  linkLabRequest: (formType: string, formId: string, labRequestId: string) => void;
  pmrForms: PMRForm[];
  savePmrForm: (f: PMRForm) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const syncIdCache = (prefix: string, items: { id: string }[]) => {
  sessionStorage.setItem(`ids_${prefix}`, JSON.stringify(items.map(x => x.id)));
};

const syncGrievousCache = (reports: MLRReport[]) => {
  const ids = reports.flatMap(r => (r.grievousEntries || []).map((g: any) => g.id));
  sessionStorage.setItem("ids_GE", JSON.stringify(ids));
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState<AppUser[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [mlefForms, setMlefForms] = useState<MLEFForm[]>([]);
  const [mlrReports, setMlrReports] = useState<MLRReport[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [pmrForms, setPmrForms] = useState<PMRForm[]>([]);

  const handleSetCurrentUser = (u: AppUser | null) => {
    if (u === null) {
      api.auth.logout();
    }
    setCurrentUser(u);
  };

  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      setPatients([]);
      setMlefForms([]);
      setMlrReports([]);
      setLabRequests([]);
      setPmrForms([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [usersData, patientsData, mlefData, mlrData, labData, pmrData] = await Promise.all([
          api.auth.getUsers().catch(() => []),
          api.patients.getAll().catch(() => []),
          api.mlef.getAll().catch(() => []),
          api.mlr.getAll().catch(() => []),
          api.lab.getAll().catch(() => []),
          api.pmr.getAll().catch(() => []),
        ]);

        setUsers(usersData || []);
        setPatients(patientsData || []);
        setMlefForms(mlefData || []);
        setMlrReports(mlrData || []);
        setLabRequests(labData || []);
        setPmrForms(pmrData || []);

        syncIdCache("USR", usersData || []);
        syncIdCache("P", patientsData || []);
        syncIdCache("MLEF", mlefData || []);
        syncIdCache("MLR", mlrData || []);
        syncIdCache("LAB", labData || []);
        syncIdCache("PMR", pmrData || []);
        syncGrievousCache(mlrData || []);
      } catch (err) {
        console.error("Error fetching application data from backend:", err);
      }
    };

    fetchData();
  }, [currentUser]);

  const addUser = async (u: AppUser) => {
    try {
      const saved = await api.auth.register(u);
      setUsers(prev => {
        const next = [...prev, saved];
        syncIdCache("USR", next);
        return next;
      });
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const addPatient = async (p: Patient) => {
    try {
      const saved = await api.patients.create(p);
      setPatients(prev => {
        const next = [...prev, saved];
        syncIdCache("P", next);
        return next;
      });
    } catch (err) {
      console.error("Failed to add patient:", err);
    }
  };

  const saveMlefForm = async (f: MLEFForm) => {
    try {
      const saved = await api.mlef.save(f);
      setMlefForms(prev => {
        const next = prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved : x) : [...prev, saved];
        syncIdCache("MLEF", next);
        return next;
      });
    } catch (err) {
      console.error("Failed to save MLEF form:", err);
    }
  };

  const saveMlrReport = async (r: MLRReport) => {
    try {
      const saved = await api.mlr.save(r);
      setMlrReports(prev => {
        const next = prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved : x) : [...prev, saved];
        syncIdCache("MLR", next);
        syncGrievousCache(next);
        return next;
      });
    } catch (err) {
      console.error("Failed to save MLR report:", err);
    }
  };

  const addLabRequest = async (r: LabRequest) => {
    try {
      const saved = await api.lab.create(r);
      setLabRequests(prev => {
        const next = [...prev, saved];
        syncIdCache("LAB", next);
        return next;
      });
    } catch (err) {
      console.error("Failed to add lab request:", err);
    }
  };

  const updateLabRequest = async (id: string, data: Partial<LabRequest>) => {
    try {
      const saved = await api.lab.update(id, data);
      setLabRequests(prev => {
        const next = prev.map(r => r.id === id ? saved : r);
        syncIdCache("LAB", next);
        return next;
      });
    } catch (err) {
      console.error("Failed to update lab request:", err);
    }
  };

  const linkLabRequest = async (formType: string, formId: string, labRequestId: string) => {
    if (formType === "mlef") {
      const form = mlefForms.find(f => f.id === formId);
      if (form) {
        const updated = { ...form, labRequestId };
        try {
          const saved = await api.mlef.save(updated);
          setMlefForms(prev => {
            const next = prev.map(f => f.id === formId ? saved : f);
            syncIdCache("MLEF", next);
            return next;
          });
        } catch (err) {
          console.error("Failed to link lab request to MLEF form:", err);
        }
      }
    } else if (formType === "mlr") {
      const report = mlrReports.find(r => r.id === formId);
      if (report) {
        const updated = { ...report, labRequestId };
        try {
          const saved = await api.mlr.save(updated);
          setMlrReports(prev => {
            const next = prev.map(r => r.id === formId ? saved : r);
            syncIdCache("MLR", next);
            return next;
          });
        } catch (err) {
          console.error("Failed to link lab request to MLR report:", err);
        }
      }
    } else if (formType === "pmr") {
      const form = pmrForms.find(f => f.id === formId);
      if (form) {
        const updated = { ...form, labRequestId };
        try {
          const saved = await api.pmr.save(updated);
          setPmrForms(prev => {
            const next = prev.map(f => f.id === formId ? saved : f);
            syncIdCache("PMR", next);
            return next;
          });
        } catch (err) {
          console.error("Failed to link lab request to PMR form:", err);
        }
      }
    }
  };

  const savePmrForm = async (f: PMRForm) => {
    try {
      const saved = await api.pmr.save(f);
      setPmrForms(prev => {
        const next = prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved : x) : [...prev, saved];
        syncIdCache("PMR", next);
        return next;
      });
    } catch (err) {
      console.error("Failed to save PMR form:", err);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser: handleSetCurrentUser,
      users, addUser,
      patients, addPatient,
      mlefForms, saveMlefForm,
      mlrReports, saveMlrReport,
      labRequests, addLabRequest, updateLabRequest, linkLabRequest,
      pmrForms, savePmrForm,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
