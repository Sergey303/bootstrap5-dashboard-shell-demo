import type { AppointmentStatus, ExternalStatus, Role, SearchReason, VetisSendStatus } from "./types";

export const appointmentStatusText: Record<AppointmentStatus, string> = {
  draft: "Черновик сохранён",
  in_progress: "Приём в работе",
  completed_internal: "Приём завершён",
  requires_external_attention: "Приём завершён",
  completed_with_external_success: "Приём завершён"
};

export const externalStatusText: Record<ExternalStatus, string> = {
  not_required: "Внешняя отправка не нужна",
  not_ready: "Для отправки не хватает данных",
  ready: "Данные готовы к отправке",
  sent: "Данные отправлены",
  failed_requires_edit: "Нужно исправить данные"
};

export const vetisSendStatusText: Record<VetisSendStatus, string> = {
  not_started: "не начата",
  queued: "ожидает отправки",
  sending: "отправляется",
  sent: "отправлено",
  fill_error: "ошибка заполнения"
};

export const searchReasonText: Record<SearchReason, string> = {
  owner_name_match: "Совпадение по владельцу",
  phone_match: "Совпадение по телефону",
  animal_name_match: "Совпадение по кличке",
  chip_match: "Совпадение по чипу",
  possible_duplicate: "Возможный дубль"
};

export const roleDisplayName: Record<Role, string> = {
  doctor: "Врач",
  registrar: "Регистратор",
  external_specialist: "Специалист внешних систем"
};

export const compactAppointmentStatusText: Record<AppointmentStatus, string> = {
  draft: "Черновик",
  in_progress: "В работе",
  completed_internal: "Завершён",
  requires_external_attention: "Правка ВЕТИС",
  completed_with_external_success: "Завершён"
};

export const compactExternalStatusText: Record<ExternalStatus, string> = {
  not_required: "Не нужна",
  not_ready: "Не хватает данных",
  ready: "Готово",
  sent: "Отправлено",
  failed_requires_edit: "Нужна правка"
};
