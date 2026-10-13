import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { createAnimalAppointmentDraft } from "../app/appointmentFactory";
import { useDemoStore } from "../app/context";
import { searchReasonText } from "../entities/status";
import type { SearchResult } from "../entities/types";

const pickReason = (query: string, animal: string, owner: string, phone: string, chip: string) => {
  if (phone.includes(query)) return "phone_match";
  if (chip.toLowerCase().includes(query)) return "chip_match";
  if (animal.toLowerCase().includes(query)) return "animal_name_match";
  if (owner.toLowerCase().includes(query)) return "owner_name_match";
  return "possible_duplicate";
};

export function SearchPanel() {
  const { state, dispatch } = useDemoStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo<SearchResult[]>(() => {
    if (!normalized) return [];
    return state.animals.flatMap((animal) => {
      const owner = state.owners.find((item) => item.id === animal.ownerId);
      if (!owner) return [];
      const values = [animal.name, animal.chip, owner.fullName, owner.phone];
      const hit = values.some((item) => item.toLowerCase().includes(normalized));
      return hit ? [{ animal, owner, reason: pickReason(normalized, animal.name, owner.fullName, owner.phone, animal.chip) }] : [];
    });
  }, [normalized, state.animals, state.owners]);

  const handleStartAppointment = (result: SearchResult) => {
    const draft = createAnimalAppointmentDraft(state, result.owner, result.animal, "Вакцинация");
    dispatch({ type: "add_appointment", appointment: draft.appointment });
    navigate(`/appointment/${draft.appointment.id}`);
  };

  return (
    <Card title="Умный поиск">
      <div className="stack">
        <InputText value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Телефон, кличка, чип, владелец" />
        {!normalized && <div>Введите запрос, чтобы выбрать животное явно.</div>}
        {normalized && results.length === 0 && <div>Не найдено. Можно создать запись без тупика.</div>}
        {results.map((result) => (
          <div className="search-item" key={`${result.owner.id}-${result.animal.id}`}>
            <div className="search-item-header">
              <div>
                <strong>{result.animal.name}</strong> · {result.animal.species} · чип {result.animal.chip}
              </div>
              <span>{searchReasonText[result.reason]}</span>
            </div>
            <div className="search-owner">
              <strong>Владелец:</strong> {result.owner.fullName} · {result.owner.phone}
            </div>
            <div className="actions-row">
              <Button label="Начать новый приём" size="small" icon="pi pi-plus" onClick={() => handleStartAppointment(result)} />
              <Button label="Страница животного" size="small" outlined onClick={() => navigate(`/animal/${result.animal.id}`)} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
