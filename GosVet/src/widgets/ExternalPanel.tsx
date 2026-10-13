import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import type { AppointmentAction, ExternalSubmission, ExternalStatus } from "../entities/types";
import { compactExternalStatusText } from "../entities/status";
import { vaccinationDisplayText } from "../entities/vaccinationDisplay";

type Props = {
  submissions: ExternalSubmission[];
  actions: AppointmentAction[];
  showProblem: boolean;
};

const panelStatus = (submissions: ExternalSubmission[]): ExternalStatus => {
  if (submissions.length === 0) return "not_required";
  if (submissions.every((item) => item.status === "sent")) return "sent";
  if (submissions.every((item) => item.status === "ready")) return "ready";
  const failed = submissions.find((item) => item.status === "failed_requires_edit");
  return failed ? "failed_requires_edit" : "not_ready";
};

export function ExternalPanel({ submissions, actions, showProblem }: Props) {
  const status = panelStatus(submissions);
  const problems = submissions.filter((item) => item.humanErrorMessage);
  return (
    <Card title="Готовность внешней отправки">
      <div className="stack">
        <Tag
          className="status-chip"
          value={compactExternalStatusText[status]}
          severity={status === "sent" || status === "ready" ? "success" : "warning"}
        />
        {submissions.map((submission) => {
          const action = actions.find((item) => item.id === submission.actionId);
          return (
            <div className="external-submission-row" key={submission.id}>
              <div>{action ? vaccinationDisplayText(action) : "Прививка"}</div>
              <Tag className="status-chip" value={compactExternalStatusText[submission.status]} />
            </div>
          );
        })}
        {problems.map((submission) => (
          <Message
            key={submission.id}
            severity={submission.status === "failed_requires_edit" ? "error" : "warn"}
            text={`Нужно исправить: ${submission.humanErrorMessage}`}
          />
        ))}
        {showProblem && status === "failed_requires_edit" && (
          <Message severity="error" text="Заявка не прошла во внешней системе. Исправьте подсвеченные данные и отправьте повторно." />
        )}
      </div>
    </Card>
  );
}
