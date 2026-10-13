import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { useDemoStore } from "../app/context";
import { findActions, findAnimalContext, findAppointmentsForAnimal, findSubmissions } from "../app/selectors";
import { AppointmentWorkspace } from "../widgets/AppointmentWorkspace";

export function AppointmentPage() {
  const { appointmentId = "" } = useParams();
  const { state } = useDemoStore();
  const { appointment, animal, owner } = findAnimalContext(state, appointmentId);
  const actions = findActions(state, appointmentId);
  const submissions = findSubmissions(state, appointmentId);

  if (!appointment || !animal || !owner) {
    return <Card title="Приём не найден">Проверьте идентификатор в маршруте.</Card>;
  }

  const history = findAppointmentsForAnimal(state, animal.id);
  const problem = state.focusedProblem?.appointmentId === appointment.id ? state.focusedProblem : null;
  return (
    <AppointmentWorkspace
      appointment={appointment}
      owner={owner}
      animal={animal}
      history={history}
      submissions={submissions}
      showProblem={Boolean(problem)}
      highlightActionId={problem?.actionId}
      highlightFieldPath={problem?.fieldPath}
      actions={actions}
    />
  );
}
