import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useApp } from "@/context/AppContext";
import { AutopsyForm } from "@/components/forms/AutopsyForm";
import { LabRequestModal } from "@/components/lab/LabRequestModal";
import type { LabRequest } from "@/types";

export function AutopsyFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, patients, autopsyForms, saveAutopsyForm, labRequests, addLabRequest, linkLabRequest } = useApp();

  const isNew = id === "new";
  const form = isNew ? null : autopsyForms.find(f => f.id === id) ?? null;
  const patientId = searchParams.get("patientId") ?? form?.patientId ?? "";
  const patient = patients.find(p => p.id === patientId) ?? null;

  const labRequest = form?.labRequestId
    ? labRequests.find(r => r.id === form.labRequestId) ?? null
    : null;

  const [showLabModal, setShowLabModal] = useState(false);
  const [labCtx, setLabCtx] = useState<{ patientId: string; formId: string; formType: string } | null>(null);

  if (!currentUser) return null;
  const readOnly = currentUser.role === "admin";

  const handleSaveLabRequest = (req: LabRequest) => {
    addLabRequest(req);
    if (labCtx) linkLabRequest(labCtx.formType, labCtx.formId, req.id);
    setShowLabModal(false);
  };

  return (
    <>
      <AutopsyForm
        form={form} patient={patient} currentUser={currentUser} labRequest={labRequest} readOnly={readOnly}
        onSave={f => { saveAutopsyForm(f); navigate("/autopsy"); }}
        onBack={() => navigate("/autopsy")}
        onRequestLab={(pid, fid, ftype) => { setLabCtx({ patientId: pid, formId: fid, formType: ftype }); setShowLabModal(true); }}
      />
      {showLabModal && labCtx && (
        <LabRequestModal
          patientId={labCtx.patientId} formId={labCtx.formId} formType={labCtx.formType}
          currentUser={currentUser} patients={patients}
          onSave={handleSaveLabRequest} onClose={() => setShowLabModal(false)}
        />
      )}
    </>
  );
}
