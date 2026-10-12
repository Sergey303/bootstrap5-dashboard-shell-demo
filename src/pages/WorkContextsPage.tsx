import { ArrowRight, CircleCheck } from "lucide-react";
import { ContextSummary } from "../context/ContextSummary";
import { useWorkContext } from "../context/WorkContextProvider";

export function WorkContextsPage() {
  const { activeContext, contexts, setActiveContext } = useWorkContext();
  return (
    <section>
      <ContextSummary
        title="Рабочие контексты"
        description="Выберите пространство, чтобы увидеть его задачи и обновления."
      />
      <div className="row g-3">
        {contexts.map((context) => {
          const active = context.id === activeContext.id;
          return (
            <div className="col-12 col-md-6 col-xl-4" key={context.id}>
              <section className={`card h-100 shadow-sm ${active ? "border-primary" : ""}`}>
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <span
                      className={`badge ${active ? "text-bg-primary" : "text-bg-light border"}`}
                    >
                      {active ? "Активный контекст" : "Рабочее пространство"}
                    </span>
                  </div>
                  <h2 className="h5">{context.name}</h2>
                  <p className="text-secondary">{context.description}</p>
                  <p className="small">
                    Открытых задач: <strong>{context.tasks}</strong>
                  </p>
                  <button
                    type="button"
                    className={`btn mt-auto d-inline-flex align-items-center justify-content-center gap-2 ${active ? "btn-primary" : "btn-outline-primary"}`}
                    aria-pressed={active}
                    onClick={() => setActiveContext(context.id)}
                  >
                    {active ? (
                      <CircleCheck size={16} aria-hidden="true" />
                    ) : (
                      <ArrowRight size={16} aria-hidden="true" />
                    )}
                    {active ? "Выбран" : `Выбрать: ${context.name}`}
                  </button>
                </div>
              </section>
            </div>
          );
        })}
      </div>
      <p className="small text-secondary mt-4 mb-0">
        Демонстрационные пространства. Выбор действует до перезагрузки страницы.
      </p>
    </section>
  );
}
