import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ContextActivity, ContextMetrics, ContextSummary } from "../context/ContextSummary";
import { useWorkContext } from "../context/WorkContextProvider";

export function DashboardHomePage() {
  const { activeContext } = useWorkContext();
  return (
    <section>
      <ContextSummary
        title="Главная"
        description="Задачи, ближайшие приоритеты и обновления рабочего пространства."
      />
      <ContextMetrics />
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <section className="card bg-light h-100">
            <div className="card-body p-4">
              <p className="small text-secondary mb-2">Текущий приоритет</p>
              <h2 className="h5 mb-3">{activeContext.focus}</h2>
              <p className="text-secondary">
                Перед следующей встречей проверьте открытые вопросы и подготовьте материалы для
                обсуждения.
              </p>
              <Link
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                to="/dashboard/overview"
              >
                Перейти к обзору
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
        <div className="col-12 col-lg-6">
          <ContextActivity />
        </div>
      </div>
    </section>
  );
}
