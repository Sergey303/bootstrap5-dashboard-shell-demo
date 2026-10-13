import type { Animal, Appointment, Owner } from "./types";

const invalidDateText = "дата-не-указана";

const parseDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatAppointmentDate = (value?: string) => {
  const date = parseDate(value);
  if (!date) return invalidDateText;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
};

export const formatAppointmentDateTime = (value?: string) => {
  const date = parseDate(value);
  if (!date) return "Дата не указана";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

export const ownerLastName = (owner: Owner) => owner.fullName.trim().split(/\s+/)[0] || owner.fullName;

export const appointmentDisplayName = (appointment: Appointment, owner: Owner, animal: Animal) =>
  `${ownerLastName(owner)}-${animal.name}-${formatAppointmentDate(appointment.startedAt)}`;
