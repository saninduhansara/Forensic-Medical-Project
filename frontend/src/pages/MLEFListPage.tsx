import { useNavigate } from "react-router";
import { ClipboardList, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FormList } from "@/components/forms/FormList";

export function MLEFListPage() {
  const { currentUser, patients, mlefForms } = useApp();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "admin";

  return (
    <FormList
      title="MLEF Forms"
      icon={<ClipboardList size={18} />}
      items={mlefForms}
      patients={patients}
      onOpen={id => navigate(`/mlef/${id}`)}
      onNew={isAdmin ? () => navigate("/mlef/new") : undefined}
      newLabel="New MLEF"
      renderExtra={item => (
        <div className="text-xs text-slate-400 mt-0.5">
          {item.mlefNo && <span>MLEF No: {item.mlefNo} · </span>}
          Police: {item.partAFilledAt
            ? <span className="text-emerald-600">✓ Filled</span>
            : <span className="text-amber-600">Pending</span>}
          {" · "}Medical: {item.partBFilledAt
            ? <span className="text-emerald-600">✓ Filled</span>
            : <span className="text-amber-600">Pending</span>}
        </div>
      )}
    />
  );
}
