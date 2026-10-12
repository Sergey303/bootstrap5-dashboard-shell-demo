import { useId } from "react";
import { useWorkContext } from "./WorkContextProvider";

export function WorkContextSelector() {
  const id = useId();
  const { activeContext, contexts, setActiveContext } = useWorkContext();

  return (
    <div className="w-100">
      <label className="form-label small text-secondary mb-1" htmlFor={id}>
        Рабочий контекст
      </label>
      <select
        id={id}
        className="form-select"
        aria-label="Рабочий контекст"
        data-testid="work-context-selector"
        value={activeContext.id}
        onChange={(event) => {
          const selected = contexts.find((context) => context.id === event.target.value);
          if (selected) setActiveContext(selected.id);
        }}
      >
        {contexts.map((context) => (
          <option key={context.id} value={context.id}>
            {context.name}
          </option>
        ))}
      </select>
    </div>
  );
}
