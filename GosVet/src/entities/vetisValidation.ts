import { vetisSendStatusText } from "./status";
import type {
  Appointment,
  AppointmentAction,
  ExternalSubmission,
  SoapField,
  VetisSendStatus
} from "./types";
import { isCompleteVaccinationAction } from "./vaccinationDisplay";

export const vetisRequiredSoapError = "Обязательное поле для отправки в ВЕТИС.";

export const vetisRequiredSoapFields: ReadonlyArray<{ key: SoapField; label: string }> = [
  { key: "complaint", label: "Жалоба" },
  { key: "soapObjective", label: "Осмотр" },
  { key: "soapAssessment", label: "Оценка / диагноз" },
  { key: "soapPlan", label: "План / назначения" }
];

export const getMissingVetisSoapFields = (appointment: Appointment) =>
  vetisRequiredSoapFields.filter((field) => !appointment[field.key].trim());

export const hasVetisVaccinationToSend = (actions: AppointmentAction[]) =>
  actions.some(isCompleteVaccinationAction);

export const evaluateVetisSubmission = (
  action: AppointmentAction,
  submission: ExternalSubmission,
  appointment?: Appointment
): ExternalSubmission => {
  if (!action.vaccineName.trim()) {
    return {
      ...submission,
      status: "not_ready",
      humanErrorMessage: "Не указан препарат",
      problemFieldPath: "vaccination.vaccineName"
    };
  }
  if (!action.vaccineSeries.trim()) {
    return {
      ...submission,
      status: "not_ready",
      humanErrorMessage: "Не указана серия вакцины",
      problemFieldPath: "vaccination.vaccineSeries"
    };
  }
  if (!action.vaccineValidUntil?.trim()) {
    return {
      ...submission,
      status: "not_ready",
      humanErrorMessage: "Не указан срок действия препарата",
      problemFieldPath: "vaccination.vaccineValidUntil"
    };
  }
  if (appointment) {
    const missingSoapField = getMissingVetisSoapFields(appointment)[0];
    if (missingSoapField) {
      return {
        ...submission,
        status: "not_ready",
        humanErrorMessage: `${missingSoapField.label}: ${vetisRequiredSoapError}`,
        problemFieldPath: `soap.${missingSoapField.key}`
      };
    }
  }
  return { ...submission, status: "ready", humanErrorMessage: "", problemFieldPath: null };
};

export const resolveVetisSendStatus = (
  appointment: Appointment,
  submissions: ExternalSubmission[]
): VetisSendStatus => {
  if (appointment.vetisStatus) return appointment.vetisStatus;
  if (submissions.some((item) => item.status === "failed_requires_edit")) return "fill_error";
  if (submissions.length > 0 && submissions.every((item) => item.status === "sent")) return "sent";
  return "not_started";
};

export const vetisStatusSeverity = (status: VetisSendStatus) => {
  if (status === "sent") return "success" as const;
  if (status === "fill_error") return "danger" as const;
  if (status === "sending") return "info" as const;
  return "warning" as const;
};

export const vetisInlineStatusLabel = (
  appointment: Appointment,
  submissions: ExternalSubmission[],
  actions: AppointmentAction[]
) => {
  const status = resolveVetisSendStatus(appointment, submissions);
  if (status === "not_started" && !hasVetisVaccinationToSend(actions)) return "не требуется";
  return vetisSendStatusText[status];
};
