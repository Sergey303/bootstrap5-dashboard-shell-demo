import { formatAppointmentDate } from "./appointmentDisplay";
import type { AppointmentAction, ExternalSubmission } from "./types";

export const isCompleteVaccinationAction = (action: AppointmentAction) =>
  Boolean(
    action.vaccineName.trim() &&
    action.vaccineSeries.trim() &&
    action.vaccineValidUntil?.trim()
  );

export const vaccinationDisplayText = (action: AppointmentAction) => {
  const name = action.vaccineName.trim() || "препарат не указан";
  const validUntil = action.vaccineValidUntil?.trim()
    ? formatAppointmentDate(action.vaccineValidUntil)
    : "не указано";
  return `${name} — препарат действует до ${validUntil}`;
};

export const vaccinationSummaryText = (actions: AppointmentAction[]) => {
  const confirmedActions = actions.filter(isCompleteVaccinationAction);
  return confirmedActions.length > 0
    ? confirmedActions.map(vaccinationDisplayText).join("; ")
    : "отсутствует";
};

export const externalSubmissionsForConfirmedVaccinations = (
  submissions: ExternalSubmission[],
  actions: AppointmentAction[]
) => {
  const confirmedActionIds = new Set(actions.filter(isCompleteVaccinationAction).map((item) => item.id));
  return submissions.filter((item) => confirmedActionIds.has(item.actionId));
};
