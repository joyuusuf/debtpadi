"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AvatarContext = createContext<{
  avatar: string | null;
  setAvatar: (src: string) => void;
}>({ avatar: null, setAvatar: () => {} });

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatar, setAvatarState] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("debtpadi_avatar");
    if (saved) setAvatarState(saved);
  }, []);

  const setAvatar = (src: string) => {
    localStorage.setItem("debtpadi_avatar", src);
    setAvatarState(src);
  };

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export const useAvatar = () => useContext(AvatarContext);