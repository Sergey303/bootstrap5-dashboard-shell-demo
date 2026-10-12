import { NavLink } from "react-router-dom";
import { dashboardRoutes } from "../routes";
import "./navigation.css";

export function DashboardNavigation() {
  return (
    <nav className="dashboard-navigation" aria-label="Основная навигация">
      <div className="dashboard-navigation-heading text-body-secondary small fw-semibold mb-2 px-3">
        Рабочее пространство
      </div>
      <ul className="nav nav-pills flex-column gap-1">
        {dashboardRoutes
          .filter((route) => route.navVisible !== false)
          .map((route) => (
            <li className="nav-item" key={route.path}>
              <NavLink
                to={route.path}
                end
                className={({ isActive }) =>
                  [
                    "nav-link dashboard-navigation-link",
                    dashboardRoutes.some(
                      (parent) => parent.path === route.parentPath && parent.parentPath,
                    )
                      ? "dashboard-navigation-link-nested"
                      : "",
                    isActive ? "active" : "text-body",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {route.label}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
