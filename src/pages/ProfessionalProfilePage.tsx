import { ProfessionalProfileForm } from "../forms/ProfessionalProfileForm";

export function ProfessionalProfilePage() {
  return (
    <section aria-labelledby="professional-profile-title">
      <div className="mb-4">
        <h1 id="professional-profile-title" className="h3 mb-2">
          Профессиональный профиль
        </h1>
        <p className="text-secondary mb-0">
          Расскажите о вашей специализации, опыте и предпочтениях в работе.
        </p>
      </div>
      <div className="card">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 mb-3">Профессиональные данные</h2>
          <ProfessionalProfileForm />
        </div>
      </div>
    </section>
  );
}
