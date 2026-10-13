import { Card } from "primereact/card";
import { Message } from "primereact/message";
import type { ExternalSubmission } from "../entities/types";
import { vetisProblemFieldLabel } from "../entities/vetisFillErrors";

type Props = {
  submissions: ExternalSubmission[];
};

export function VetisErrorPanel({ submissions }: Props) {
  const failures = submissions.filter((item) => item.status === "failed_requires_edit" && item.humanErrorMessage);
  if (failures.length === 0) return null;

  return (
    <Card title="Ошибка заполнения ВЕТИС" className="vetis-error-card">
      <div className="stack">
        <Message
          severity="error"
          text="ВЕТИС отклонил завершённый приём. Исправьте данные и отправьте повторно."
        />
        <div className="vetis-error-list">
          {failures.map((failure) => {
            const fieldLabel = vetisProblemFieldLabel(failure.problemFieldPath);
            return (
              <div className="vetis-error-item" key={failure.id}>
                {fieldLabel && <strong>{fieldLabel}</strong>}
                <span>{failure.humanErrorMessage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
