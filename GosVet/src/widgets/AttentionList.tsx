import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";
import { useDemoStore } from "../app/context";
import { findActions, findAnimalContext, selectAttentionAppointments } from "../app/selectors";
import { appointmentDisplayName, formatAppointmentDateTime } from "../entities/appointmentDisplay";
import { compactAppointmentStatusText, vetisSendStatusText } from "../entities/status";
import { resolveVetisSendStatus, vetisStatusSeverity } from "../entities/vetisValidation";
import { vaccinationSummaryText } from "../entities/vaccinationDisplay";

const attentionIntro = "Черновики и завершённые приёмы, где ВЕТИС требует исправления данных.";

export function AttentionList() {
  const { state } = useDemoStore();
  const navigate = useNavigate();
  const items = selectAttentionAppointments(state);
  if (items.length === 0) {
    return (
      <Card title="Требуют внимания" className="attention-page-card">
        <div className="muted-line">Нет открытых проблем.</div>
      </Card>
    );
  }
  return (
    <div className="attention-page stack">
      <Card className="attention-page-card attention-page-card-hero">
        <div className="attention-page-heading">
          <div>
            <h1>Требуют внимания</h1>
            <p>{attentionIntro}</p>
          </div>
          <Tag value={`${items.length}`} severity="info" />
        </div>
      </Card>
      <div className="attention-list">
        {items.map((appointment) => {
          const { animal, owner } = findAnimalContext(state, appointment.id);
          const actions = findActions(state, appointment.id);
          const appointmentSubmissions = state.submissions.filter((item) => item.appointmentId === appointment.id);
          const vetisStatus = resolveVetisSendStatus(appointment, appointmentSubmissions);
          const failed = appointment.status === "requires_external_attention" || appointmentSubmissions.some(
            (item) => item.status === "failed_requires_edit"
          );
          const displayName = animal && owner
            ? appointmentDisplayName(appointment, owner, animal)
            : "Приём требует внимания";
          const actionLabel = failed ? "Исправить и отправить" : "Открыть черновик";
          const reasonText = failed
            ? "ВЕТИС отклонил заполнение. Откройте приём, исправьте подсвеченные поля и отправьте повторно."
            : "Черновик сохранён, но приём не завершён. Откройте карточку и завершите работу.";
          return (
            <Card key={appointment.id} className={`attention-card ${failed ? "attention-card-danger" : ""}`}>
              <div className="attention-item">
                <div className="attention-main">
                  <div className="attention-title-row">
                    <div className="attention-title-main">
                      <i className={failed ? "pi pi-exclamation-triangle" : "pi pi-pencil"} aria-hidden="true" />
                      <h2>{displayName}</h2>
                    </div>
                    <div className="attention-chip-row">
                      <Tag
                        className="status-chip"
                        value={compactAppointmentStatusText[appointment.status]}
                        severity={failed ? "danger" : "warning"}
                      />
                      {failed && (
                        <Tag
                          className="status-chip"
                          value={`ВЕТИС: ${vetisSendStatusText[vetisStatus]}`}
                          severity={vetisStatusSeverity(vetisStatus)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="attention-reason">{reasonText}</div>
                  <dl className="attention-meta">
                    <div>
                      <dt>Дата</dt>
                      <dd>{formatAppointmentDateTime(appointment.startedAt)}</dd>
                    </div>
                    <div>
                      <dt>Причина</dt>
                      <dd>{appointment.reason}</dd>
                    </div>
                    <div>
                      <dt>Животное</dt>
                      <dd>{animal ? `${animal.name} · ${animal.species} · чип ${animal.chip}` : "не найдено"}</dd>
                    </div>
                    <div>
                      <dt>Владелец</dt>
                      <dd>{owner ? `${owner.fullName} · ${owner.phone}` : "не найден"}</dd>
                    </div>
                    <div className="wide">
                      <dt>Прививка</dt>
                      <dd>{vaccinationSummaryText(actions)}</dd>
                    </div>
                  </dl>
                </div>
                <div className="attention-actions">
                  <Button
                    label={actionLabel}
                    icon={failed ? "pi pi-send" : "pi pi-pencil"}
                    onClick={() => navigate(failed ? `/external/retry/${appointment.id}` : `/appointment/${appointment.id}`)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
