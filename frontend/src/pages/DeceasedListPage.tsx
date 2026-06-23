import { useNavigate } from "react-router";
import { BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FormList } from "@/components/forms/FormList";

export function DeceasedListPage() {
  const { currentUser, patients, deceasedForms } = useApp();
  const navigate = useNavigate();
  const isDoctor = currentUser?.role === "doctor";

  // Deceased forms aren't linked to a patient record, so we synthesise the patient lookup
  const pseudoPatients = deceasedForms.map(f => ({
    id: f.id, name: f.name, dob: "", age: Number(f.age) || 0, sex: f.sex,
    address: f.address, nic: f.nic, registeredAt: f.createdAt, registeredBy: f.createdBy,
  }));
  const items = deceasedForms.map(f => ({ ...f, patientId: f.id }));

  return (
    <FormList
      title="Deceased Forms"
      icon={<BookOpen size={18} />}
      items={items}
      patients={[...patients, ...pseudoPatients]}
      onOpen={id => navigate(`/deceased/${id}`)}
      onNew={isDoctor ? () => navigate("/deceased/new") : undefined}
      newLabel="New Deceased Form"
    />
  );
}
