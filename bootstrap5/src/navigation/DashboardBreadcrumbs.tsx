import { Link, useLocation } from "react-router-dom";
import { dashboardRoutes, type DashboardRoute } from "../routes";
import "./navigation.css";

export function DashboardBreadcrumbs() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const breadcrumbs: DashboardRoute[] = [];
  let route = dashboardRoutes.find((entry) => entry.path === normalizedPath);

  while (route && !breadcrumbs.includes(route)) {
    breadcrumbs.unshift(route);
    const parentPath = route.parentPath;
    route = dashboardRoutes.find((entry) => entry.path === parentPath);
  }

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className="dashboard-breadcrumbs"
      aria-label="Хлебные крошки"
      data-testid="dashboard-breadcrumbs"
    >
      <ol className="breadcrumb mb-0 small">
        {breadcrumbs.map((entry, index) => (
          <li
            key={entry.path}
            className={`breadcrumb-item${index === breadcrumbs.length - 1 ? " active" : ""}`}
            aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
          >
            {index === breadcrumbs.length - 1 ? (
              entry.label
            ) : (
              <Link to={entry.path}>{entry.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
