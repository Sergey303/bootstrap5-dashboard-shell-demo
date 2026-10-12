import { useWorkContext } from "./WorkContextProvider";

export function ContextSummary({ title, description }: { title: string; description: string }) {
  const { activeContext } = useWorkContext();
  return (
    <header className="mb-4">
      <p className="small text-secondary mb-2" aria-live="polite">
        Рабочий контекст: <strong>{activeContext.name}</strong>
      </p>
      <h1 className="h3">{title}</h1>
      <p className="text-secondary mb-0">{description}</p>
    </header>
  );
}

export function ContextMetrics() {
  const { activeContext } = useWorkContext();
  const metrics = [
    { label: "Открытые задачи", value: activeContext.tasks, detail: "В текущем рабочем плане" },
    {
      label: "Завершено за неделю",
      value: activeContext.completed,
      detail: "Задачи с готовым результатом",
    },
    {
      label: "На обсуждении",
      value: activeContext.reviews,
      detail: "Вопросы для следующей встречи",
    },
  ];
  return (
    <div className="row g-3 mb-4">
      {metrics.map((metric) => (
        <div className="col-12 col-md-4" key={metric.label}>
          <section className="card h-100 border shadow-sm">
            <div className="card-body">
              <h2 className="h6 text-secondary">{metric.label}</h2>
              <p className="fs-2 fw-semibold mb-1">{metric.value}</p>
              <p className="small text-secondary mb-0">{metric.detail}</p>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

export function ContextActivity() {
  const { activeContext } = useWorkContext();
  return (
    <section className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5 mb-1">Последние обновления</h2>
        <p className="small text-secondary mb-0">Пример активности выбранного пространства</p>
      </div>
      <ul className="list-group list-group-flush">
        {activeContext.activity.map((item, index) => (
          <li className="list-group-item py-3" key={item}>
            <p className="mb-1">{item}</p>
            <span className="small text-secondary">
              {["Сегодня", "Вчера", "На этой неделе"][index]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
