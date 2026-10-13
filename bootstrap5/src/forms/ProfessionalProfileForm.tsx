import { useId, useRef, useState, type FormEvent } from "react";
import { RotateCcw, Save } from "lucide-react";
import { defaultProfessionalProfile, type ProfessionalProfile } from "./professionalProfile";
import { useProfile } from "../context/ProfileProvider";

type Errors = Partial<Record<keyof ProfessionalProfile, string>>;

function validateExperience(experience: string): string | undefined {
  const years = Number(experience);
  if (
    !experience.trim() ||
    !Number.isFinite(years) ||
    !Number.isInteger(years) ||
    years < 0 ||
    years > 50
  ) {
    return "Введите целое число от 0 до 50.";
  }
  return undefined;
}

function validate(values: ProfessionalProfile): Errors {
  const errors: Errors = {};
  if (!values.role.trim()) errors.role = "Укажите вашу должность.";
  if (!values.specialization.trim()) errors.specialization = "Укажите специализацию.";
  const experienceError = validateExperience(values.experience);
  if (experienceError) errors.experience = experienceError;
  if (values.bio.length > 240) errors.bio = "Сократите описание до 240 символов.";
  return errors;
}

export function ProfessionalProfileForm() {
  const { profile, saveProfile } = useProfile();
  const prefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ProfessionalProfile>(() => ({ ...profile }));
  const [errors, setErrors] = useState<Errors>({});
  const [feedback, setFeedback] = useState("");

  function update<K extends keyof ProfessionalProfile>(field: K, value: ProfessionalProfile[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setFeedback("");
    setErrors((current) => ({
      ...current,
      [field]: field === "experience" ? validateExperience(String(value)) : undefined,
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFeedback("Проверьте отмеченные поля.");
      const firstField = Object.keys(nextErrors)[0];
      const control = formRef.current?.elements.namedItem(firstField);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    saveProfile({ ...values });
    setFeedback("Изменения сохранены в демонстрационном профиле до перезагрузки страницы.");
  }

  function reset() {
    setValues({ ...defaultProfessionalProfile });
    setErrors({});
    setFeedback("Восстановлены исходные значения.");
  }

  function attributes(field: keyof ProfessionalProfile, hint?: string) {
    return {
      id: `${prefix}-${field}`,
      name: field,
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby":
        [hint ? `${prefix}-${field}-hint` : "", errors[field] ? `${prefix}-${field}-error` : ""]
          .filter(Boolean)
          .join(" ") || undefined,
    };
  }

  function error(field: keyof ProfessionalProfile) {
    return errors[field] ? (
      <div id={`${prefix}-${field}-error`} className="invalid-feedback">
        {errors[field]}
      </div>
    ) : null;
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      onReset={reset}
      data-testid="professional-profile-form"
    >
      <p className="text-secondary small mb-4">
        Обязательные поля отмечены звёздочкой (*). Сохранённые данные отображаются на странице
        просмотра профиля до перезагрузки приложения.
      </p>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}-role`}>
            Должность *
          </label>
          <input
            {...attributes("role")}
            className={`form-control${errors.role ? " is-invalid" : ""}`}
            value={values.role}
            onChange={(event) => update("role", event.target.value)}
            required
            autoComplete="organization-title"
          />
          {error("role")}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}-specialization`}>
            Специализация *
          </label>
          <input
            {...attributes("specialization")}
            className={`form-control${errors.specialization ? " is-invalid" : ""}`}
            value={values.specialization}
            onChange={(event) => update("specialization", event.target.value)}
            required
          />
          {error("specialization")}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}-experience`}>
            Опыт работы, лет *
          </label>
          <input
            {...attributes("experience", "range")}
            className={`form-control${errors.experience ? " is-invalid" : ""}`}
            type="number"
            min={0}
            max={50}
            step={1}
            required
            value={values.experience}
            onChange={(event) => update("experience", event.target.value)}
          />
          <div id={`${prefix}-experience-hint`} className="form-text">
            Целое число от 0 до 50.
          </div>
          {error("experience")}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}-city`}>
            Город <span className="text-secondary small">(необязательно)</span>
          </label>
          <input
            {...attributes("city")}
            className="form-control"
            value={values.city}
            onChange={(event) => update("city", event.target.value)}
            autoComplete="address-level2"
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}-workFormat`}>
            Формат работы
          </label>
          <select
            {...attributes("workFormat")}
            className="form-select"
            value={values.workFormat}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "hybrid" || value === "office" || value === "remote")
                update("workFormat", value);
            }}
          >
            <option value="hybrid">Гибридный</option>
            <option value="office">В офисе</option>
            <option value="remote">Удалённый</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor={`${prefix}-bio`}>
            О себе <span className="text-secondary small">(необязательно)</span>
          </label>
          <textarea
            {...attributes("bio", "limit")}
            className={`form-control${errors.bio ? " is-invalid" : ""}`}
            rows={4}
            value={values.bio}
            onChange={(event) => update("bio", event.target.value)}
          />
          <div id={`${prefix}-bio-hint`} className="form-text">
            Кратко опишите ваш профессиональный опыт. {values.bio.length} / 240 символов.
          </div>
          {error("bio")}
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2 border-top pt-4 mt-4">
        <button
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          type="submit"
          data-testid="profile-submit"
        >
          <Save size={16} aria-hidden="true" />
          Сохранить изменения
        </button>
        <button
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
          type="reset"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Сбросить к исходным
        </button>
      </div>
      <p
        className={`mb-0 mt-3 small${Object.values(errors).some(Boolean) ? " text-danger" : " text-success"}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="profile-feedback"
      >
        {feedback}
      </p>
    </form>
  );
}
