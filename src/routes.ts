export type DashboardRoute = {
  path: string;
  label: string;
  description: string;
};

// A single registry drives routing and navigation.
// The UI shell will be implemented in a separate change.
export const dashboardRoutes: readonly DashboardRoute[] = [
  { path: "/dashboard", label: "Главная", description: "Обзор рабочего пространства" },
  { path: "/dashboard/overview", label: "Обзор", description: "Краткая информация по активности" },
  { path: "/dashboard/profile", label: "Профиль", description: "Общие сведения о пользователе" },
  {
    path: "/dashboard/profile/professional",
    label: "Профессиональный профиль",
    description: "Профессиональные сведения и форма",
  },
  {
    path: "/dashboard/work-contexts",
    label: "Рабочие контексты",
    description: "Переключение рабочего контекста",
  },
  { path: "/dashboard/settings", label: "Настройки", description: "Настройки интерфейса" },
];
