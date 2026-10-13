export type VetisProblemFieldPath =
  | "vaccination.vaccineName"
  | "vaccination.vaccineSeries"
  | "vaccination.vaccineValidUntil"
  | "soap.complaint"
  | "soap.soapObjective"
  | "soap.soapAssessment"
  | "soap.soapPlan";

export type VetisFillError = {
  message: string;
  fieldPath: VetisProblemFieldPath | null;
  fieldLabel?: string;
};

export const vetisFillErrors: VetisFillError[] = [
  {
    message: "Серия вакцины не найдена в реестре ВЕТИС. Проверьте серию с упаковки препарата.",
    fieldPath: "vaccination.vaccineSeries",
    fieldLabel: "Серия вакцины"
  },
  {
    message: "Препарат не сопоставлен со справочником ВЕТИС. Выберите препарат из справочника или добавьте локальное соответствие.",
    fieldPath: "vaccination.vaccineName",
    fieldLabel: "Препарат"
  },
  {
    message: "В плане назначений не указано, что вакцинация выполнена и животное допущено к процедуре.",
    fieldPath: "soap.soapPlan",
    fieldLabel: "План / назначения"
  },
  {
    message: "Дата окончания действия препарата не совпадает с допустимым сроком партии в ВЕТИС.",
    fieldPath: "vaccination.vaccineValidUntil",
    fieldLabel: "Препарат действует до"
  },
  {
    message: "В описании осмотра не хватает обязательного заключения о состоянии животного перед вакцинацией.",
    fieldPath: "soap.soapObjective",
    fieldLabel: "Осмотр"
  },
  {
    message: "В диагнозе не указано клиническое состояние животного перед вакцинацией.",
    fieldPath: "soap.soapAssessment",
    fieldLabel: "Оценка / диагноз"
  },
  {
    message: "В жалобе или анамнезе не хватает причины обращения для регистрации события вакцинации.",
    fieldPath: "soap.complaint",
    fieldLabel: "Жалоба"
  }
];

export const pickVetisFillError = (attemptNumber: number) =>
  vetisFillErrors[Math.max(0, attemptNumber - 1) % vetisFillErrors.length];

export const vetisProblemFieldLabel = (fieldPath: string | null) =>
  vetisFillErrors.find((item) => item.fieldPath === fieldPath)?.fieldLabel;
