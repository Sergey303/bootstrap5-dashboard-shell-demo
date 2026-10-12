import { useEffect, useId, useRef, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Offcanvas from "bootstrap/js/dist/offcanvas";
import "./DashboardShell.css";

interface DashboardShellProps {
  children: ReactNode;
  navigation: ReactNode;
  breadcrumbs: ReactNode;
  workContext: ReactNode;
  pageTitle?: string;
}

export function DashboardShell({
  children,
  navigation,
  breadcrumbs,
  workContext,
  pageTitle,
}: DashboardShellProps) {
  const navigationRef = useRef<HTMLDivElement>(null);
  const id = `dashboard-navigation-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const location = useLocation();

  useEffect(() => {
    const element = navigationRef.current;
    if (!element) return;
    const instance = Offcanvas.getOrCreateInstance(element);

    return () => {
      // Bootstrap must finish its transition before its instance is disposed.
      if (element.classList.contains("showing")) {
        element.addEventListener("hidden.bs.offcanvas", () => instance.dispose(), {
          once: true,
        });
        element.addEventListener("shown.bs.offcanvas", () => instance.hide(), {
          once: true,
        });
      } else if (element.classList.contains("show") || element.classList.contains("hiding")) {
        element.addEventListener("hidden.bs.offcanvas", () => instance.dispose(), {
          once: true,
        });
        instance.hide();
      } else {
        instance.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const element = navigationRef.current;
    if (!element) return;
    const hide = () => Offcanvas.getInstance(element)?.hide();
    if (element.classList.contains("showing")) {
      element.addEventListener("shown.bs.offcanvas", hide, { once: true });
    } else {
      hide();
    }
    return () => element.removeEventListener("shown.bs.offcanvas", hide);
  }, [location.key]);

  return (
    <div className="dashboard-shell" data-testid="dashboard-shell">
      <a className="dashboard-shell-skip" href={`#${id}-main`}>
        Перейти к содержимому
      </a>
      <header className="dashboard-shell-topbar">
        <div className="dashboard-shell-brand-row">
          <button
            type="button"
            className="btn btn-outline-secondary dashboard-shell-toggle d-lg-none"
            data-bs-toggle="offcanvas"
            data-bs-target={`#${id}`}
            aria-controls={id}
            aria-label="Открыть меню навигации"
            data-testid="mobile-toggle"
          >
            <span aria-hidden="true">☰</span>
          </button>
          <Link to="/dashboard" className="dashboard-shell-brand">
            <span className="dashboard-shell-brand-mark" aria-hidden="true">
              К
            </span>
            <span>Рабочий кабинет</span>
          </Link>
        </div>
        <div className="dashboard-shell-context">{workContext}</div>
      </header>
      <div className="dashboard-shell-layout">
        <div
          ref={navigationRef}
          id={id}
          className="offcanvas-lg offcanvas-start dashboard-shell-sidebar"
          tabIndex={-1}
          aria-labelledby={`${id}-title`}
          data-testid="mobile-offcanvas"
        >
          <div className="offcanvas-header border-bottom">
            <h2 className="offcanvas-title fs-5" id={`${id}-title`}>
              Навигация
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              data-bs-target={`#${id}`}
              aria-label="Закрыть меню навигации"
            />
          </div>
          <div className="offcanvas-body dashboard-shell-sidebar-body">
            <div className="dashboard-shell-navigation" data-testid="desktop-navigation">
              <p className="dashboard-shell-section-label d-none d-lg-block">
                Рабочее пространство
              </p>
              {navigation}
            </div>
          </div>
        </div>
        <main id={`${id}-main`} className="dashboard-shell-main" tabIndex={-1}>
          <div className="dashboard-shell-breadcrumbs" data-testid="dashboard-breadcrumbs">
            {breadcrumbs}
          </div>
          {pageTitle && <h1 className="dashboard-shell-title">{pageTitle}</h1>}
          <div className="dashboard-shell-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
