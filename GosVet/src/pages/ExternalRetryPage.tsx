import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { useDemoStore } from "../app/context";
import {
  findActions,
  findAnimalContext,
  findAppointmentsForAnimal,
  findSubmissions
} from "../app/selectors";
import { AppointmentWorkspace } from "../widgets/AppointmentWorkspace";

export function ExternalRetryPage() {
  const { appointmentId = "" } = useParams();
  const { state, dispatch } = useDemoStore();
  useEffect(() => {
    dispatch({ type: "check_readiness", appointmentId });
  }, [appointmentId, dispatch]);
  const { appointment, animal, owner } = findAnimalContext(state, appointmentId);
  const actions = findActions(state, appointmentId);
  const submissions = findSubmissions(state, appointmentId);
  if (!appointment || !animal || !owner) {
    return <Card title="Повторная отправка">Карточка не найдена.</Card>;
  }
  const history = findAppointmentsForAnimal(state, animal.id);
  const problem = submissions.find((item) => item.problemFieldPath);
  return (
    <AppointmentWorkspace
      appointment={appointment}
      owner={owner}
      animal={animal}
      history={history}
      submissions={submissions}
      showProblem={true}
      highlightActionId={problem?.actionId}
      highlightFieldPath={problem?.problemFieldPath ?? undefined}
      actions={actions}
    />
  );
}
