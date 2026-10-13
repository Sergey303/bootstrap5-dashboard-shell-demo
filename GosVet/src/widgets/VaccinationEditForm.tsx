import { InputText } from "primereact/inputtext";
import { vaccinationDisplayText } from "../entities/vaccinationDisplay";
import type { AppointmentAction } from "../entities/types";
import { DatePickerField } from "./DatePickerField";
import { DictionaryAutoComplete } from "./DictionaryAutoComplete";

type Props = {
  action: AppointmentAction;
  index: number;
  options: string[];
  nameInvalid: boolean;
  seriesInvalid: boolean;
  validUntilInvalid: boolean;
  highlightName: boolean;
  highlightSeries: boolean;
  highlightValidUntil: boolean;
  disabled?: boolean;
  nameExternalError?: string;
  seriesExternalError?: string;
  validUntilExternalError?: string;
  titleLabel?: string;
  onNameChange: (value: string) => void;
  onSeriesChange: (value: string) => void;
  onValidUntilChange: (value: string) => void;
  onAddDictionary: (value: string) => void;
  onNameValidityChange: (valid: boolean) => void;
  onTouched: (field: string) => void;
};

export function VaccinationEditForm(props: Props) {
  const {
    action,
    index,
    options,
    nameInvalid,
    seriesInvalid,
    validUntilInvalid,
    titleLabel,
    disabled = false,
    nameExternalError,
    seriesExternalError,
    validUntilExternalError
  } = props;
  return (
    <div className="vaccination-editor">
      <div className="vaccination-editor-title">
        <strong>{titleLabel ?? `Прививка ${index + 1}`}</strong>
        <span>{vaccinationDisplayText(action)}</span>
      </div>
      <label className="field">
        <span>Препарат <span className="required-mark">*</span></span>
        <DictionaryAutoComplete
          value={action.vaccineName}
          options={options}
          onValueChange={props.onNameChange}
          onAddValue={props.onAddDictionary}
          onBlur={() => props.onTouched("vaccineName")}
          onValidityChange={props.onNameValidityChange}
          invalid={nameInvalid || props.highlightName || Boolean(nameExternalError)}
          required={true}
          strictDictionary={true}
          immutable={false}
          disabled={disabled}
        />
        {nameInvalid && <small className="field-error">Укажите препарат из справочника.</small>}
        {nameExternalError && <small className="field-error">{nameExternalError}</small>}
      </label>
      <label className="field">
        <span>Серия вакцины <span className="required-mark">*</span></span>
        <InputText
          disabled={disabled}
          className={`${props.highlightSeries || seriesExternalError ? "problem-field " : ""}${seriesInvalid ? "p-invalid" : ""}`.trim()}
          value={action.vaccineSeries}
          onBlur={() => props.onTouched("vaccineSeries")}
          onChange={(event) => props.onSeriesChange(event.target.value)}
        />
        {seriesInvalid && <small className="field-error">Укажите серию вакцины.</small>}
        {seriesExternalError && <small className="field-error">{seriesExternalError}</small>}
      </label>
      <label className="field">
        <span>Препарат действует до <span className="required-mark">*</span></span>
        <DatePickerField
          disabled={disabled}
          className={props.highlightValidUntil || validUntilExternalError ? "problem-field" : undefined}
          inputClassName={validUntilInvalid ? "p-invalid" : undefined}
          value={action.vaccineValidUntil ?? ""}
          onChange={props.onValidUntilChange}
        />
        {validUntilInvalid && <small className="field-error">Укажите срок действия препарата.</small>}
        {validUntilExternalError && <small className="field-error">{validUntilExternalError}</small>}
      </label>
    </div>
  );
}
