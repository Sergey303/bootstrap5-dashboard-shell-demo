import { createContext, useContext, useState, type ReactNode } from "react";
import { defaultProfessionalProfile, type ProfessionalProfile } from "../forms/professionalProfile";

type ProfileContextValue = {
  profile: ProfessionalProfile;
  saveProfile: (profile: ProfessionalProfile) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, saveProfile] = useState<ProfessionalProfile>(() => ({
    ...defaultProfessionalProfile,
  }));

  return (
    <ProfileContext.Provider value={{ profile, saveProfile }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within ProfileProvider");
  return context;
}
