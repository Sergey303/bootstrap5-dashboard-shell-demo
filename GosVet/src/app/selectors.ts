import type { Appointment } from "../entities/types";
import type { AppState } from "./state";

export const findAppointment = (state: AppState, appointmentId: string) =>
  state.appointments.find((item) => item.id === appointmentId);

export const findAction = (state: AppState, appointmentId: string) =>
  state.actions.find((item) => item.appointmentId === appointmentId);

export const findActions = (state: AppState, appointmentId: string) =>
  state.actions.filter((item) => item.appointmentId === appointmentId);

export const findSubmission = (state: AppState, appointmentId: string) =>
  state.submissions.find((item) => item.appointmentId === appointmentId);

export const findSubmissions = (state: AppState, appointmentId: string) =>
  state.submissions.filter((item) => item.appointmentId === appointmentId);

export const sortAppointmentsByDateDesc = <T extends { startedAt?: string; id: string }>(items: T[]) =>
  [...items].sort((left, right) => {
    const leftTime = Date.parse(left.startedAt ?? "") || 0;
    const rightTime = Date.parse(right.startedAt ?? "") || 0;
    return rightTime - leftTime || right.id.localeCompare(left.id);
  });

export const findAppointmentsForAnimal = (state: AppState, animalId: string) =>
  sortAppointmentsByDateDesc(state.appointments.filter((item) => item.animalId === animalId));

export const findAnimalContext = (state: AppState, appointmentId: string) => {
  const appointment = findAppointment(state, appointmentId);
  const animal = state.animals.find((item) => item.id === appointment?.animalId);
  const owner = state.owners.find((item) => item.id === appointment?.ownerId);
  return { appointment, animal, owner };
};

const toLocalDateInputValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const todayDateInputValue = () => toLocalDateInputValue(new Date());

export const appointmentDateInputValue = (appointment: Appointment) => {
  const date = new Date(appointment.startedAt);
  return Number.isNaN(date.getTime()) ? "" : toLocalDateInputValue(date);
};

export const isAppointmentOnDate = (appointment: Appointment, dateValue: string) =>
  appointmentDateInputValue(appointment) === dateValue;

export const isAttentionAppointment = (state: AppState, appointment: Appointment) => {
  const hasFailedSubmission = state.submissions.some(
    (item) => item.appointmentId === appointment.id && item.status === "failed_requires_edit"
  );
  return appointment.status === "draft" || appointment.status === "requires_external_attention" || hasFailedSubmission;
};

export const selectAttentionAppointments = (state: AppState) =>
  sortAppointmentsByDateDesc(
    state.appointments.filter(
      (item) => item.clinicId === state.selectedClinicId && isAttentionAppointment(state, item)
    )
  );
