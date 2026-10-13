import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useDemoStore } from "../app/context";
import { externalSubmissionsForConfirmedVaccinations } from "../entities/vaccinationDisplay";
import { getMissingVetisSoapFields, hasVetisVaccinationToSend } from "../entities/vetisValidation";
import type { Appointment, AppointmentAction, ExternalSubmission } from "../entities/types";

type Props = {
  appointment: Appointment;
  actions: AppointmentAction[];
  submissions: ExternalSubmission[];
  displayName: string;
};

const hasRequiredExternalData = (
  appointment: Appointment,
  submissions: ExternalSubmission[],
  actions: AppointmentAction[]
) => {
  const requiredSubmissions = externalSubmissionsForConfirmedVaccinations(submissions, actions);
  if (requiredSubmissions.length === 0 || !hasVetisVaccinationToSend(actions)) return true;
  return getMissingVetisSoapFields(appointment).length === 0 &&
    requiredSubmissions.every((item) => item.status !== "not_ready");
};

const canEditAppointment = (appointment: Appointment) =>
  appointment.status === "draft" ||
  appointment.status === "in_progress" ||
  appointment.status === "requires_external_attention" ||
  appointment.vetisStatus === "fill_error";

const canCompleteAppointment = (appointment: Appointment) =>
  appointment.status === "draft" || appointment.status === "in_progress";

const canRetryAppointment = (appointment: Appointment) =>
  appointment.status === "requires_external_attention" || appointment.vetisStatus === "fill_error";

const isVetisSending = (appointment: Appointment) =>
  appointment.vetisStatus === "queued" || appointment.vetisStatus === "sending";

export function BottomBar({ appointment, actions, submissions, displayName }: Props) {
  const { dispatch } = useDemoStore();
  const navigate = useNavigate();
  const editableMode = canEditAppointment(appointment);
  const completeMode = canCompleteAppointment(appointment);
  const retryMode = canRetryAppointment(appointment);
  const canSend = hasRequiredExternalData(appointment, submissions, actions);
  const handleDelete = () => {
    if (!window.confirm(`Удалить приём «${displayName}»?`)) return;
    dispatch({ type: "delete_appointment", appointmentId: appointment.id });
    navigate(`/animal/${appointment.animalId}`);
  };
  const handleComplete = () => {
    const confirmed = window.confirm(
      "Завершить приём? После подтверждения приём будет отправлен в ВЕТИС."
    );
    if (!confirmed) return;
    dispatch({ type: "complete", appointmentId: appointment.id });
  };
  return (
    <div className="appointment-bottom-bar">
      <div className="actions-row">
        {editableMode && (
          <Button label="Сохранить черновик" onClick={() => dispatch({ type: "save_draft", appointmentId: appointment.id })} />
        )}
        {completeMode && (
          <Button
            label="Завершить приём"
            severity="success"
            disabled={!canSend}
            onClick={handleComplete}
          />
        )}
        {retryMode && (
          <Button
            label={isVetisSending(appointment) ? "Отправка идёт" : "Отправить повторно"}
            severity="success"
            disabled={!canSend || isVetisSending(appointment)}
            onClick={() => dispatch({ type: "retry", appointmentId: appointment.id })}
          />
        )}
        <Button label="Удалить" icon="pi pi-trash" severity="danger" outlined onClick={handleDelete} />
      </div>
    </div>
  );
}
