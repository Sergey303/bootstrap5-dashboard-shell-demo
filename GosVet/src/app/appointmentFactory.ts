import type {
  Animal,
  Appointment,
  AppointmentAction,
  ExternalSubmission,
  Owner
} from "../entities/types";
import type { AppState } from "./state";

const fallbackDoctor = "Соколова Анна Викторовна";

export type AppointmentDraft = {
  appointment: Appointment;
  action?: AppointmentAction;
  submission?: ExternalSubmission;
};

export type VaccinationActionDraft = {
  action: AppointmentAction;
  submission: ExternalSubmission;
};

const token = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const toStartedAt = (value: string | undefined, fallbackMs: number) => {
  if (!value) return new Date(fallbackMs).toISOString();
  const source = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T09:00:00` : value;
  const date = new Date(source);
  return Number.isNaN(date.getTime()) ? new Date(fallbackMs).toISOString() : date.toISOString();
};

const findLastDoctor = (state: AppState, animalId: string) => {
  const lastAppointment = state.appointments
    .filter((item) => item.animalId === animalId)
    .sort((left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt))[0];
  return lastAppointment?.doctor || fallbackDoctor;
};

export const createVaccinationActionDraft = (appointmentId: string): VaccinationActionDraft => {
  const idToken = token();
  const actionId = `action-${idToken}`;
  return {
    action: {
      id: actionId,
      appointmentId,
      type: "vaccination",
      vaccineName: "",
      vaccineSeries: "",
      vaccineValidUntil: ""
    },
    submission: {
      id: `sub-${idToken}`,
      appointmentId,
      actionId,
      status: "not_ready",
      humanErrorMessage: "Не указан препарат",
      problemFieldPath: "vaccination.vaccineName"
    }
  };
};

export const createAnimalAppointmentDraft = (
  state: AppState,
  owner: Owner,
  animal: Animal,
  reason: string,
  startedAt?: string
): AppointmentDraft => {
  const createdAt = Date.now();
  const appointmentId = `visit-${createdAt}`;
  return {
    appointment: {
      id: appointmentId,
      clinicId: state.selectedClinicId,
      doctor: findLastDoctor(state, animal.id),
      ownerId: owner.id,
      animalId: animal.id,
      reason: reason.trim() || "Новый приём",
      startedAt: toStartedAt(startedAt, createdAt),
      status: "in_progress",
      complaint: "",
      soapObjective: "",
      soapAssessment: "",
      soapPlan: ""
    }
  };
};
