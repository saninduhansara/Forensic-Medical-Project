import { useState } from "react";
import { Save, Eye } from "lucide-react";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { genId } from "@/lib/utils";
import type { DeceasedForm as DeceasedFormType, AppUser } from "@/types";

interface Props {
  form: DeceasedFormType | null;
  currentUser: AppUser;
  readOnly?: boolean;
  onSave: (f: DeceasedFormType) => void;
  onBack: () => void;
}

const MANNER_OPTIONS = [
  { value: "natural",      label: "Natural" },
  { value: "accident",     label: "Accident" },
  { value: "suicide",      label: "Suicide" },
  { value: "homicide",     label: "Homicide" },
  { value: "undetermined", label: "Undetermined" },
];

export function DeceasedForm({ form: initForm, currentUser, readOnly = false, onSave, onBack }: Props) {
  const isNew = !initForm;
  const now = new Date().toISOString();

  const [f, setF] = useState<DeceasedFormType>(initForm ?? {
    id: genId("DEC"),
    name: "", age: "", sex: "Male", address: "", nic: "",
    dateTimeOfDeath: "", placeOfDeath: "", causeOfDeath: "", mannerOfDeath: "",
    informantName: "", informantRelation: "", informantAddress: "",
    identifyingMarks: "", certificateIssuedBy: currentUser.name,
    policeStation: "", crNo: "", remarks: "",
    status: "draft", createdAt: now, createdBy: currentUser.id,
  });

  const s = (k: keyof DeceasedFormType) => (v: string) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader
        title={isNew ? "New Deceased Form" : `Deceased Form — ${f.id}`}
        onBack={onBack}
        actions={!readOnly
          ? (
            <Btn variant="primary" icon={<Save size={14} />}
              onClick={() => { onSave({ ...f, status: "submitted" }); onBack(); }}>
              Save Deceased Form
            </Btn>
          ) : undefined
        }
      />

      {readOnly && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          <Eye size={13} /> This form is read-only. Only the submitting doctor can edit it.
        </div>
      )}

      <div className="max-w-3xl space-y-0">
        <FormSection title="Deceased Particulars">
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Full Name" required><Input value={f.name} onChange={s("name")} disabled={readOnly} /></FormField>
            <FormField label="NIC Number"><Input value={f.nic} onChange={s("nic")} disabled={readOnly} /></FormField>
            <FormField label="Age"><Input value={f.age} onChange={s("age")} disabled={readOnly} /></FormField>
            <FormField label="Sex">
              <Select value={f.sex} onChange={s("sex")} disabled={readOnly}
                options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Unknown", label: "Unknown" }]} />
            </FormField>
            <FormField label="Address" colSpan="full"><Textarea value={f.address} onChange={s("address")} disabled={readOnly} rows={2} /></FormField>
            <FormField label="Identifying Marks" colSpan="full">
              <Textarea value={f.identifyingMarks} onChange={s("identifyingMarks")} disabled={readOnly} rows={2} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Death Details">
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Date & Time of Death"><Input type="datetime-local" value={f.dateTimeOfDeath} onChange={s("dateTimeOfDeath")} disabled={readOnly} /></FormField>
            <FormField label="Place of Death"><Input value={f.placeOfDeath} onChange={s("placeOfDeath")} disabled={readOnly} /></FormField>
            <FormField label="Cause of Death" colSpan="full"><Textarea value={f.causeOfDeath} onChange={s("causeOfDeath")} disabled={readOnly} rows={3} /></FormField>
            <FormField label="Manner of Death">
              <Select value={f.mannerOfDeath} onChange={s("mannerOfDeath")} disabled={readOnly} placeholder="Select..." options={MANNER_OPTIONS} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Police Information">
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Police Station"><Input value={f.policeStation} onChange={s("policeStation")} disabled={readOnly} /></FormField>
            <FormField label="CR No."><Input value={f.crNo} onChange={s("crNo")} disabled={readOnly} /></FormField>
          </div>
        </FormSection>

        <FormSection title="Informant Details">
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Informant Name"><Input value={f.informantName} onChange={s("informantName")} disabled={readOnly} /></FormField>
            <FormField label="Relationship"><Input value={f.informantRelation} onChange={s("informantRelation")} disabled={readOnly} /></FormField>
            <FormField label="Informant Address" colSpan="full"><Input value={f.informantAddress} onChange={s("informantAddress")} disabled={readOnly} /></FormField>
          </div>
        </FormSection>

        <FormSection title="Certificate">
          <FormField label="Certificate Issued By"><Input value={f.certificateIssuedBy} onChange={s("certificateIssuedBy")} disabled={readOnly} /></FormField>
          <FormField label="Remarks"><Textarea value={f.remarks} onChange={s("remarks")} disabled={readOnly} rows={3} /></FormField>
        </FormSection>
      </div>
    </div>
  );
}
