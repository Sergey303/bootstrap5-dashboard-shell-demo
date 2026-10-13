import { useEffect } from "react";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { useDemoStore } from "../app/context";
import { vetisSendStatusText } from "../entities/status";
import type { Appointment, AppointmentAction, ExternalSubmission, VetisSendStatus } from "../entities/types";
import { resolveVetisSendStatus, vetisStatusSeverity } from "../entities/vetisValidation";
import { vaccinationDisplayText } from "../entities/vaccinationDisplay";

type Props = {
  appointment: Appointment;
  actions: AppointmentAction[];
  submissions: ExternalSubmission[];
};

const finalStatuses: VetisSendStatus[] = ["not_started", "sent", "fill_error"];

export function VetisStatusPanel({ appointment, actions, submissions }: Props) {
  const { dispatch } = useDemoStore();
  const status = resolveVetisSendStatus(appointment, submissions);
  const shouldShow = status !== "not_started" || submissions.some((item) => item.status === "sent" || item.status === "failed_requires_edit");

  useEffect(() => {
    if (finalStatuses.includes(status)) return undefined;
    const timer = window.setTimeout(() => {
      dispatch({ type: "advance_vetis_sending", appointmentId: appointment.id });
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [appointment.id, dispatch, status]);

  if (!shouldShow) return null;

  const failedSubmission = submissions.find((item) => item.status === "failed_requires_edit" && item.humanErrorMessage);
  const hasFailure = status === "fill_error" || Boolean(failedSubmission);
  return (
    <Card title="Отправка данных в ВЕТИС" className="vetis-status-card">
      <div className="stack">
        <div className="vetis-status-row">
          <span className="muted-line">Текущий статус</span>
          <Tag className="status-chip" value={vetisSendStatusText[status]} severity={vetisStatusSeverity(status)} />
        </div>
        {actions.length > 0 && (
          <div className="vetis-submission-list">
            {actions.map((action) => (
              <div className="vetis-submission-item" key={action.id}>{vaccinationDisplayText(action)}</div>
            ))}
          </div>
        )}
        {status === "queued" && <Message severity="info" text="Данные ожидают отправки. Статус обновится через 3 секунды." />}
        {status === "sending" && <Message severity="info" text="Данные отправляются в ВЕТИС. Статус обновится через 3 секунды." />}
        {status === "sent" && <Message severity="success" text="Данные успешно отправлены в ВЕТИС." />}
        {hasFailure && (
          <Message
            severity="error"
            text={failedSubmission?.humanErrorMessage ?? "Ошибка заполнения: ВЕТИС отклонил отправку."}
          />
        )}
      </div>
    </Card>
  );
}
