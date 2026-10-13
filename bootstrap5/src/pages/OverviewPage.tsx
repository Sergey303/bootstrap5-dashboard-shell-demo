import { ContextActivity, ContextMetrics, ContextSummary } from "../context/ContextSummary";
import { useWorkContext } from "../context/WorkContextProvider";

export function OverviewPage() {
  const { activeContext } = useWorkContext();
  return (
    <section>
      <ContextSummary
        title="Обзор"
        description="Сводка по текущему плану и вопросам, которые требуют внимания."
      />
      <ContextMetrics />
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <ContextActivity />
        </div>
        <div className="col-12 col-lg-5">
          <section className="card h-100">
            <div className="card-body">
              <h2 className="h5">К следующей встрече</h2>
              <p className="text-secondary">{activeContext.focus}</p>
              <ol className="ps-3 mb-0">
                <li className="mb-3">Проверить результаты завершённых задач.</li>
                <li className="mb-3">Разобрать вопросы на обсуждении: {activeContext.reviews}.</li>
                <li>Уточнить следующий шаг и срок по каждой открытой задаче.</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
