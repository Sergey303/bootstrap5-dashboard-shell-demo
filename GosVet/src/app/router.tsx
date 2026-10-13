import { Navigate, Route, Routes } from "react-router-dom";
import { AnimalPage } from "../pages/AnimalPage";
import { AppointmentPage } from "../pages/AppointmentPage";
import { AttentionPage } from "../pages/AttentionPage";
import { DemoSettingsPage } from "../pages/DemoSettingsPage";
import { ExternalRetryPage } from "../pages/ExternalRetryPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { SearchPage } from "../pages/SearchPage";
import { TodayAppointmentsPage } from "../pages/TodayAppointmentsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/appointments/today" replace />} />
      <Route path="/appointments/today" element={<TodayAppointmentsPage />} />
      <Route path="/appointment/:appointmentId" element={<AppointmentPage />} />
      <Route path="/animal/:animalId" element={<AnimalPage />} />
      <Route path="/external/retry/:appointmentId" element={<ExternalRetryPage />} />
      <Route path="/attention" element={<AttentionPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/demo-settings" element={<DemoSettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
