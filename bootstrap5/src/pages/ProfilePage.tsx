import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { demoIdentity } from "../forms/professionalProfile";
import { useProfile } from "../context/ProfileProvider";

export function ProfilePage() {
  const { profile } = useProfile();
  const workFormatLabels = { hybrid: "Гибридный", office: "В офисе", remote: "Удалённый" };
  return (
    <section aria-labelledby="profile-title">
      <div className="mb-4">
        <p className="text-secondary small mb-2">Личный кабинет</p>
        <h1 id="profile-title" className="h3 mb-2">
          Профиль
        </h1>
        <p className="text-secondary mb-0">Основные сведения и профессиональная информация.</p>
      </div>
      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <article className="card h-100">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <span
                  className="rounded-circle bg-primary-subtle text-primary p-3 fw-semibold"
                  aria-hidden="true"
                >
                  {demoIdentity.initials}
                </span>
                <div>
                  <h2 className="h5 mb-1">{demoIdentity.name}</h2>
                  <span className="badge text-bg-light border text-wrap">
                    Демонстрационный профиль
                  </span>
                </div>
              </div>
              <dl className="mb-0">
                <dt className="small text-secondary fw-normal">Электронная почта</dt>
                <dd className="text-break mb-3">{demoIdentity.email}</dd>
                <dt className="small text-secondary fw-normal">Город</dt>
                <dd className="mb-0">{profile.city}</dd>
              </dl>
            </div>
          </article>
        </div>
        <div className="col-12 col-xl-7">
          <article className="card h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-4">Профессиональные сведения</h2>
              <dl className="row mb-2">
                <dt className="col-sm-4 text-secondary fw-normal">Должность</dt>
                <dd className="col-sm-8">{profile.role}</dd>
                <dt className="col-sm-4 text-secondary fw-normal">Специализация</dt>
                <dd className="col-sm-8">{profile.specialization}</dd>
                <dt className="col-sm-4 text-secondary fw-normal">Опыт работы</dt>
                <dd className="col-sm-8">{profile.experience} лет</dd>
                <dt className="col-sm-4 text-secondary fw-normal">Формат работы</dt>
                <dd className="col-sm-8">{workFormatLabels[profile.workFormat]}</dd>
              </dl>
              <p className="text-secondary">{profile.bio}</p>
              <Link
                className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                to="/dashboard/profile/professional"
              >
                <Pencil size={16} aria-hidden="true" />
                Редактировать профессиональный профиль
              </Link>
            </div>
          </article>
        </div>
      </div>
      <p className="small text-secondary mt-3 mb-0">
        Все сведения вымышлены и используются для демонстрации интерфейса.
      </p>
    </section>
  );
}
