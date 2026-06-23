import { useNavigate } from "react-router";
import { FileText } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FormList } from "@/components/forms/FormList";

export function MLRListPage() {
  const { currentUser, patients, mlrReports } = useApp();
  const navigate = useNavigate();
  const isDoctor = currentUser?.role === "doctor";

  return (
    <FormList
      title="MLR Reports"
      icon={<FileText size={18} />}
      items={mlrReports}
      patients={patients}
      onOpen={id => navigate(`/mlr/${id}`)}
      onNew={isDoctor ? () => navigate("/mlr/new") : undefined}
      newLabel="New MLR Report"
    />
  );
}
