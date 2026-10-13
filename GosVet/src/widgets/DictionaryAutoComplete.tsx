import { useMemo, useRef, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";

type SuggestionOption = { label: string; value: string; isAdd: boolean };

type Props = {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  onAddValue: (value: string) => void;
  onBlur?: () => void;
  onValidityChange?: (valid: boolean) => void;
  invalid?: boolean;
  required?: boolean;
  strictDictionary?: boolean;
  immutable?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const infoText =
  "Локальные значения можно использовать внутри клиники. Для внешней отправки требуется официальное значение.";

const isOption = (value: unknown): value is SuggestionOption =>
  typeof value === "object" &&
  value !== null &&
  "label" in value &&
  "value" in value &&
  "isAdd" in value;

export function DictionaryAutoComplete(props: Props) {
  const {
    value,
    options,
    onValueChange,
    onAddValue,
    onBlur,
    onValidityChange,
    invalid = false,
    required = false,
    strictDictionary = true,
    immutable = false,
    placeholder,
    disabled = false
  } = props;
  const inputRef = useRef<AutoComplete<SuggestionOption>>(null);
  const [suggestions, setSuggestions] = useState<SuggestionOption[]>([]);
  const [pendingAdd, setPendingAdd] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const uniqueOptions = useMemo(() => Array.from(new Set(options)), [options]);
  const buildSuggestions = (query: string) => {
    const trimmed = query.trim();
    const normalized = trimmed.toLowerCase();
    const filtered = normalized
      ? uniqueOptions.filter((item) => item.toLowerCase().includes(normalized))
      : uniqueOptions;
    const matches = filtered.map((item) => ({ label: item, value: item, isAdd: false }));
    const hasExact = uniqueOptions.some((item) => item.toLowerCase() === normalized);
    const canAdd = !immutable && Boolean(trimmed) && !hasExact && matches.length === 0;
    if (canAdd) matches.push({ label: `+ Добавить и использовать «${trimmed}»`, value: trimmed, isAdd: true });
    setSuggestions(matches);
  };
  const closeDialog = () => {
    setShowConfirm(false);
    setPendingAdd(null);
  };
  const confirmAdd = () => {
    if (!pendingAdd) return;
    onAddValue(pendingAdd);
    onValueChange(pendingAdd);
    onValidityChange?.(true);
    closeDialog();
  };
  const validateCurrentValue = () => {
    if (!strictDictionary) return true;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return !required;
    return uniqueOptions.some((item) => item.toLowerCase() === normalized);
  };
  return (
    <>
      <AutoComplete
        ref={inputRef}
        field="label"
        value={value}
        suggestions={suggestions}
        minLength={0}
        inputClassName={invalid ? "p-invalid" : undefined}
        placeholder={placeholder}
        disabled={disabled}
        completeMethod={(event) => buildSuggestions(event.query)}
        onFocus={(event) => inputRef.current?.search(event, "", "dropdown")}
        onBlur={() => {
          onBlur?.();
          onValidityChange?.(validateCurrentValue());
        }}
        onChange={(event) => {
          const next = event.value;
          if (typeof next === "string") onValueChange(next);
          else if (isOption(next)) onValueChange(next.value);
        }}
        onSelect={(event) => {
          const selected = event.value;
          if (!isOption(selected)) return;
          if (!selected.isAdd) return onValueChange(selected.value);
          setPendingAdd(selected.value);
          setShowConfirm(true);
        }}
      />
      <Dialog
        header="Добавить новый вариант в справочник?"
        visible={showConfirm}
        style={{ width: "min(560px, calc(100vw - 24px))" }}
        onHide={closeDialog}
      >
        <div className="stack">
          <Message severity="info" text={infoText} />
          {pendingAdd && <div>Будет добавлено значение: «{pendingAdd}»</div>}
          <div className="actions-row">
            <Button label="Отмена" outlined onClick={closeDialog} />
            <Button label="+ Добавить и использовать" onClick={confirmAdd} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
