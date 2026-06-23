import { useNavigate, useParams } from "react-router";
import { useApp } from "@/context/AppContext";
import { DeceasedForm } from "@/components/forms/DeceasedForm";

export function DeceasedFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, deceasedForms, saveDeceasedForm } = useApp();

  const isNew = id === "new";
  const form = isNew ? null : deceasedForms.find(f => f.id === id) ?? null;

  if (!currentUser) return null;
  const readOnly = currentUser.role === "admin";

  return (
    <DeceasedForm
      form={form}
      currentUser={currentUser}
      readOnly={readOnly}
      onSave={f => { saveDeceasedForm(f); navigate("/deceased"); }}
      onBack={() => navigate("/deceased")}
    />
  );
}
