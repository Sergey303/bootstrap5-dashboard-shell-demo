import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { createAnimalAppointmentDraft } from "../app/appointmentFactory";
import { useDemoStore } from "../app/context";
import { findAppointmentsForAnimal } from "../app/selectors";
import { appointmentDisplayName } from "../entities/appointmentDisplay";
import { vaccinationSummaryText } from "../entities/vaccinationDisplay";
import type { Appointment } from "../entities/types";
import { AppointmentHistory } from "../widgets/AppointmentHistory";

export function AnimalPage() {
  const { animalId = "" } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDemoStore();
  const [reason, setReason] = useState("Вакцинация");
  const animal = state.animals.find((item) => item.id === animalId);
  const owner = state.owners.find((item) => item.id === animal?.ownerId);
  const appointments = findAppointmentsForAnimal(state, animalId);

  if (!animal || !owner) return <Card title="Животное не найдено">Проверьте идентификатор в маршруте.</Card>;

  const getDisplayName = (appointment: Appointment) => appointmentDisplayName(appointment, owner, animal);
  const getVaccinations = (appointment: Appointment) =>
    vaccinationSummaryText(state.actions.filter((action) => action.appointmentId === appointment.id));

  const handleAddAppointment = () => {
    const draft = createAnimalAppointmentDraft(state, owner, animal, reason);
    dispatch({ type: "add_appointment", appointment: draft.appointment });
    navigate(`/appointment/${draft.appointment.id}`);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const appointment = appointments.find((item) => item.id === appointmentId);
    const label = appointment ? getDisplayName(appointment) : "выбранный приём";
    if (!window.confirm(`Удалить приём «${label}»?`)) return;
    dispatch({ type: "delete_appointment", appointmentId });
  };

  return (
    <section className="stack-lg">
      <Card title={`${animal.name} — карточка животного`}>
        <div className="animal-card-layout">
          <div className="stack">
            <div><strong>Вид:</strong> {animal.species}</div>
            <div><strong>Чип:</strong> {animal.chip}</div>
            <div><strong>Владелец:</strong> {owner.fullName} · {owner.phone}</div>
          </div>
          <div className="animal-appointment-form">
            <label className="field compact-field">
              <span>Причина нового приёма</span>
              <InputText value={reason} onChange={(event) => setReason(event.target.value)} />
            </label>
            <Button label="Добавить приём" icon="pi pi-plus" onClick={handleAddAppointment} />
          </div>
        </div>
      </Card>
      <Card title="История приёмов">
        <AppointmentHistory
          appointments={appointments}
          emptyText="У животного пока нет приёмов."
          getAppointmentDisplayName={getDisplayName}
          getVaccinationSummary={getVaccinations}
          onDeleteAppointment={handleDeleteAppointment}
        />
      </Card>
    </section>
  );
}
