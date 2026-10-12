import type { DashboardRoute } from "../routes";

export function ScaffoldPage({ route }: { route: DashboardRoute }) {
  return (
    <section aria-labelledby="page-title">
      <p className="text-uppercase text-secondary small mb-2">Scaffold / route placeholder</p>
      <h1 id="page-title" className="h3">{route.label}</h1>
      <p className="text-secondary">{route.description}</p>
      <div className="alert alert-info" role="status">
        Маршрут подключён. Dashboard Shell и содержимое страницы появятся на следующем этапе.
      </div>
    </section>
  );
}
