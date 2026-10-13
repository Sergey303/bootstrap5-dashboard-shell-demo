import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";
import { formatAppointmentDateTime } from "../entities/appointmentDisplay";
import { compactAppointmentStatusText } from "../entities/status";
import type { Appointment } from "../entities/types";

type Props = {
  appointments: Appointment[];
  activeAppointmentId?: string;
  emptyText?: string;
  getAppointmentDisplayName?: (appointment: Appointment) => string;
  getVaccinationSummary?: (appointment: Appointment) => string;
  onDeleteAppointment?: (appointmentId: string) => void;
};

export function AppointmentHistory(props: Props) {
  const { appointments, activeAppointmentId, emptyText, getAppointmentDisplayName, getVaccinationSummary, onDeleteAppointment } = props;
  const navigate = useNavigate();
  if (appointments.length === 0) return <div>{emptyText ?? "Истории приёмов пока нет."}</div>;
  return (
    <div className="history-list">
      {appointments.map((item) => {
        const isActive = item.id === activeAppointmentId;
        const displayName = getAppointmentDisplayName?.(item) ?? `Приём от ${formatAppointmentDateTime(item.startedAt)}`;
        return (
          <div className={isActive ? "history-item active" : "history-item"} key={item.id}>
            <div className="history-item-main">
              <div><strong>{displayName}</strong></div>
              <div>{formatAppointmentDateTime(item.startedAt)} · {item.reason}</div>
              {getVaccinationSummary && <div className="history-meta"><strong>Прививка:</strong> {getVaccinationSummary(item)}</div>}
              <div className="history-meta">{item.doctor} · {isActive ? "текущий приём" : "предыдущий приём"}</div>
            </div>
            <div className="history-item-actions">
              <Tag className="status-chip" value={compactAppointmentStatusText[item.status]} severity="warning" />
              {!isActive && <Button label="Открыть" size="small" outlined onClick={() => navigate(`/appointment/${item.id}`)} />}
              {onDeleteAppointment && (
                <Button
                  aria-label="Удалить приём"
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  size="small"
                  tooltip="Удалить приём"
                  onClick={() => onDeleteAppointment(item.id)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
