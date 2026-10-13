import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import type { Appointment, SoapField } from "../entities/types";
import { vetisRequiredSoapError } from "../entities/vetisValidation";
import { useDemoStore } from "../app/context";

type Props = {
  appointment: Appointment;
  readOnly?: boolean;
  fieldErrors?: Partial<Record<SoapField, string>>;
  highlightFieldPath?: string;
  requiredForVetis?: boolean;
};

const rows = [
  { key: "complaint", label: "Жалоба" },
  { key: "soapObjective", label: "Осмотр" },
  { key: "soapAssessment", label: "Оценка / диагноз" },
  { key: "soapPlan", label: "План / назначения" }
] as const;

export function SoapEditor({
  appointment,
  readOnly = false,
  fieldErrors = {},
  highlightFieldPath,
  requiredForVetis = false
}: Props) {
  const { dispatch } = useDemoStore();
  return (
    <Card title="Карточка приёма">
      <div className="stack">
        {requiredForVetis && !readOnly && (
          <div className="vetis-required-hint">
            <i className="pi pi-info-circle" aria-hidden="true" />
            <span>Поля со звёздочкой обязательны для отправки приёма в ВЕТИС.</span>
          </div>
        )}
        {rows.map((row) => {
          const externalError = fieldErrors[row.key];
          const requiredError = requiredForVetis && !appointment[row.key].trim() ? vetisRequiredSoapError : "";
          const highlighted = highlightFieldPath === `soap.${row.key}`;
          const invalid = highlighted || Boolean(externalError) || Boolean(requiredError);
          return (
            <label key={row.key} className="field">
              <span>
                {row.label}{requiredForVetis && <span className="required-mark"> *</span>}
              </span>
              <InputTextarea
                autoResize
                rows={3}
                value={appointment[row.key]}
                disabled={readOnly}
                className={invalid ? "problem-field" : undefined}
                onChange={(event) =>
                  dispatch({
                    type: "update_soap",
                    appointmentId: appointment.id,
                    field: row.key,
                    value: event.target.value
                  })
                }
              />
              {requiredError && <small className="field-error">{requiredError}</small>}
              {externalError && <small className="field-error">{externalError}</small>}
            </label>
          );
        })}
      </div>
    </Card>
  );
}
