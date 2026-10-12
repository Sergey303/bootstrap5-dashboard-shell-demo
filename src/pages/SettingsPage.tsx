import { useId, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ContextSummary } from "../context/ContextSummary";
import "./settings.css";

export function SettingsPage() {
  const id = useId();
  const [compact, setCompact] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  return (
    <section className="settings-page">
      <ContextSummary
        title="Настройки"
        description="Попробуйте варианты отображения интерфейса в примере ниже."
      />
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <section className="card h-100 settings-display-panel">
            <div className="card-body">
              <h2 className="h5 mb-3">Отображение</h2>
              <div className="form-check form-switch mb-3">
                <input
                  id={`${id}-compact`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={compact}
                  onChange={(event) => setCompact(event.target.checked)}
                />
                <label className="form-check-label" htmlFor={`${id}-compact`}>
                  Компактные карточки
                </label>
              </div>
              <div className="form-check form-switch mb-4">
                <input
                  id={`${id}-details`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={showDetails}
                  onChange={(event) => setShowDetails(event.target.checked)}
                />
                <label className="form-check-label" htmlFor={`${id}-details`}>
                  Показывать пояснения
                </label>
              </div>
              <button
                className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                type="button"
                onClick={() => {
                  setCompact(false);
                  setShowDetails(true);
                }}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Вернуть исходный вид
              </button>
              <p className="small text-secondary mt-3 mb-0">
                Настройки изменяют только этот пример и сбрасываются при выходе со страницы. Они не
                сохраняются.
              </p>
            </div>
          </section>
        </div>
        <div className="col-12 col-lg-6">
          <section className="card bg-light h-100 settings-preview-panel">
            <div className="card-body">
              <h2 className="h5 mb-3">Предпросмотр</h2>
              <div className={`card settings-preview-sample ${compact ? "p-2" : "p-4"}`}>
                <h3 className="h6 mb-2">Подготовка к встрече</h3>
                {showDetails && (
                  <p className="small text-secondary">
                    Соберите вопросы и материалы перед обсуждением рабочего плана.
                  </p>
                )}
                <span className="small text-primary">В рабочем плане</span>
              </div>
              <p className="small text-secondary mt-3 mb-0 settings-preview-status" role="status">
                Вид: {compact ? "компактный" : "обычный"}. Пояснения{" "}
                {showDetails ? "показаны" : "скрыты"}.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
