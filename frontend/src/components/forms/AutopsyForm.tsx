import { useState } from "react";
import { Save, FlaskConical, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { CheckGroup } from "@/components/ui/CheckGroup";
import { PageHeader } from "@/components/ui/PageHeader";
import { genId } from "@/lib/utils";
import type { AutopsyForm as AutopsyFormType, Patient, AppUser, LabRequest } from "@/types";

interface Props {
  form: AutopsyFormType | null;
  patient: Patient | null;
  currentUser: AppUser;
  labRequest: LabRequest | null;
  readOnly?: boolean;
  onSave: (f: AutopsyFormType) => void;
  onBack: () => void;
  onRequestLab: (patientId: string, formId: string, formType: string) => void;
}

const MANNER_OPTIONS = [
  { value: "natural",       label: "Natural" },
  { value: "accident",      label: "Accident" },
  { value: "suicide",       label: "Suicide" },
  { value: "homicide",      label: "Homicide" },
  { value: "undetermined",  label: "Undetermined" },
];

export function AutopsyForm({ form: initForm, patient, currentUser, labRequest, readOnly = false, onSave, onBack, onRequestLab }: Props) {
  const isNew = !initForm;
  const now = new Date().toISOString();

  const [f, setF] = useState<AutopsyFormType>(initForm ?? {
    id: genId("AUTO"), patientId: patient?.id ?? "",
    deceasedName: patient?.name ?? "", deceasedAge: patient ? String(patient.age) : "", deceasedSex: patient?.sex ?? "Male",
    autopsyDateTime: "", autopsyPlace: "", requestingOfficer: "", mlefNo: "",
    externalExamination: "", internalExamination: "",
    causeOfDeath: "", mannerOfDeath: "",
    toxicologyRequested: false, histologyRequested: false, otherTests: "",
    conclusion: "", doctorName: currentUser.name, doctorQualifications: "",
    labRequestId: "", status: "draft", createdAt: now, createdBy: currentUser.id,
  });

  const s = (k: keyof AutopsyFormType) => (v: string) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader
        title={isNew ? "New Autopsy Form" : `Autopsy — ${f.id}`}
        subtitle={patient ? `Patient: ${patient.name} · ${patient.id}` : undefined}
        onBack={onBack}
        actions={
          <div className="flex gap-2">
            {!readOnly && !f.labRequestId && (
              <Btn variant="secondary" size="sm" icon={<FlaskConical size={13} />}
                onClick={() => onRequestLab(f.patientId, f.id, "autopsy")}>
                Request Lab Report
              </Btn>
            )}
            {!readOnly && (
              <Btn variant="primary" icon={<Save size={14} />}
                onClick={() => { onSave({ ...f, status: "submitted" }); onBack(); }}>
                Save Autopsy Report
              </Btn>
            )}
          </div>
        }
      />

      {readOnly && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          <Eye size={13} /> This form is read-only. Only the submitting doctor can edit it.
        </div>
      )}

      {f.labRequestId && labRequest && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
          <FlaskConical size={15} /> Lab Requested · <Badge status={labRequest.status} />
        </div>
      )}

      <div className="max-w-3xl space-y-0">
        <FormSection title="Deceased Particulars">
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Deceased Name"><Input value={f.deceasedName} onChange={s("deceasedName")} disabled={readOnly} /></FormField>
            <FormField label="Age"><Input value={f.deceasedAge} onChange={s("deceasedAge")} disabled={readOnly} /></FormField>
            <FormField label="Sex">
              <Select value={f.deceasedSex} onChange={s("deceasedSex")} disabled={readOnly}
                options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
            </FormField>
            <FormField label="MLEF No."><Input value={f.mlefNo} onChange={s("mlefNo")} disabled={readOnly} /></FormField>
            <FormField label="Date & Time of Autopsy"><Input type="datetime-local" value={f.autopsyDateTime} onChange={s("autopsyDateTime")} disabled={readOnly} /></FormField>
            <FormField label="Place of Autopsy"><Input value={f.autopsyPlace} onChange={s("autopsyPlace")} disabled={readOnly} /></FormField>
            <FormField label="Requesting Officer" colSpan="full"><Input value={f.requestingOfficer} onChange={s("requestingOfficer")} disabled={readOnly} /></FormField>
          </div>
        </FormSection>

        <FormSection title="External Examination Findings">
          <Textarea value={f.externalExamination} onChange={s("externalExamination")} disabled={readOnly} rows={5} placeholder="Describe external examination findings..." />
        </FormSection>

        <FormSection title="Internal Examination Findings">
          <Textarea value={f.internalExamination} onChange={s("internalExamination")} disabled={readOnly} rows={5} placeholder="Describe internal examination findings..." />
        </FormSection>

        <FormSection title="Cause and Manner of Death">
          <FormField label="Cause of Death">
            <Textarea value={f.causeOfDeath} onChange={s("causeOfDeath")} disabled={readOnly} rows={3} />
          </FormField>
          <FormField label="Manner of Death">
            <Select value={f.mannerOfDeath} onChange={s("mannerOfDeath")} disabled={readOnly} placeholder="Select..." options={MANNER_OPTIONS} />
          </FormField>
        </FormSection>

        <FormSection title="Laboratory Investigations Requested">
          <div className="flex flex-wrap gap-4 mb-3">
            <CheckGroup label="Toxicology" checked={f.toxicologyRequested} onChange={v => setF(prev => ({ ...prev, toxicologyRequested: v }))} disabled={readOnly} />
            <CheckGroup label="Histology" checked={f.histologyRequested} onChange={v => setF(prev => ({ ...prev, histologyRequested: v }))} disabled={readOnly} />
          </div>
          <FormField label="Other Tests"><Input value={f.otherTests} onChange={s("otherTests")} disabled={readOnly} /></FormField>
        </FormSection>

        <FormSection title="Conclusion & Medical Officer">
          <FormField label="Conclusion">
            <Textarea value={f.conclusion} onChange={s("conclusion")} disabled={readOnly} rows={4} />
          </FormField>
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Name of Medical Officer"><Input value={f.doctorName} onChange={s("doctorName")} disabled={readOnly} /></FormField>
            <FormField label="Qualifications"><Input value={f.doctorQualifications} onChange={s("doctorQualifications")} disabled={readOnly} /></FormField>
          </div>
        </FormSection>
      </div>
    </div>
  );
}
