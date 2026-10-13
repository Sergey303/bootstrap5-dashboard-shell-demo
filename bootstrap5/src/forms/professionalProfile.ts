export type ProfessionalProfile = {
  role: string;
  specialization: string;
  experience: string;
  city: string;
  workFormat: "hybrid" | "office" | "remote";
  bio: string;
};

export const defaultProfessionalProfile: ProfessionalProfile = {
  role: "Руководитель проектов",
  specialization: "Развитие цифровых сервисов",
  experience: "8",
  city: "Казань",
  workFormat: "hybrid",
  bio: "Помогаю командам запускать понятные и полезные цифровые сервисы.",
};

export const demoIdentity = {
  name: "Алексей Примеров",
  initials: "АП",
  email: "alexey.primerov@example.com",
};
