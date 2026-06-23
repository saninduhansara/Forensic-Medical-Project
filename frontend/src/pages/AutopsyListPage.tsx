import { useNavigate } from "react-router";
import { Clipboard } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FormList } from "@/components/forms/FormList";

export function AutopsyListPage() {
  const { currentUser, patients, autopsyForms } = useApp();
  const navigate = useNavigate();
  const isDoctor = currentUser?.role === "doctor";

  return (
    <FormList
      title="Autopsy Forms"
      icon={<Clipboard size={18} />}
      items={autopsyForms}
      patients={patients}
      onOpen={id => navigate(`/autopsy/${id}`)}
      onNew={isDoctor ? () => navigate("/autopsy/new") : undefined}
      newLabel="New Autopsy Form"
    />
  );
}
