import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ScaffoldPage } from "./pages/ScaffoldPage";
import { dashboardRoutes } from "./routes";

export function App() {
  const { pathname } = useLocation();

  return (
    <div className="min-vh-100 bg-body-tertiary">
      <header className="bg-white border-bottom">
        <div className="container py-3">
          <Link className="fw-semibold text-decoration-none" to="/dashboard">
            Dashboard Shell · Bootstrap 5
          </Link>
        </div>
      </header>
      <div className="container py-4">
        <nav className="d-flex flex-wrap gap-2 mb-4" aria-label="Маршруты демо">
          {dashboardRoutes.map((route) => (
            <Link
              key={route.path}
              className={
                pathname === route.path
                  ? "btn btn-primary btn-sm"
                  : "btn btn-outline-secondary btn-sm"
              }
              to={route.path}
              aria-current={pathname === route.path ? "page" : undefined}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <main className="bg-white border rounded-3 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {dashboardRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<ScaffoldPage route={route} />} />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
