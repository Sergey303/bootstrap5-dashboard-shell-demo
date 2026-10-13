import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useDemoStore } from "../app/context";
import type { Role } from "../entities/types";
import { roleDisplayName } from "../entities/status";

const roleOptions: { label: string; value: Role }[] = [
  { label: roleDisplayName.doctor, value: "doctor" },
  { label: roleDisplayName.registrar, value: "registrar" },
  { label: roleDisplayName.external_specialist, value: "external_specialist" }
];

export function DemoSettingsPage() {
  const { state, dispatch, reset } = useDemoStore();
  const [role, setRole] = useState<Role>(state.selectedRole);
  return (
    <Card title="Настройки демо">
      <div className="stack">
        <label className="field">
          <span>Должность</span>
          <Dropdown value={role} options={roleOptions} onChange={(event) => setRole(event.value)} />
        </label>
        <Button
          label="Сохранить должность"
          onClick={() => dispatch({ type: "select_context", clinicId: state.selectedClinicId, role })}
        />
        <div>Сброс возвращает исходный сценарий и очищает локальное состояние демо.</div>
        <Button label="Сбросить демо" severity="danger" onClick={reset} />
      </div>
    </Card>
  );
}
