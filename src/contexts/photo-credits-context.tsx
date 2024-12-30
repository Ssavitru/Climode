"use client";

import { createContext, useContext, useState } from "react";

interface PhotoCredit {
  photographerName: string;
  photographerUrl: string;
  isDefault: boolean;
}

interface PhotoCreditsContextType {
  photoCredit: PhotoCredit | null;
  setPhotoCredit: (credit: PhotoCredit | null) => void;
}

const PhotoCreditsContext = createContext<PhotoCreditsContextType | undefined>(
  undefined,
);

export function PhotoCreditsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [photoCredit, setPhotoCredit] = useState<PhotoCredit | null>(null);

  return (
    <PhotoCreditsContext.Provider value={{ photoCredit, setPhotoCredit }}>
      {children}
    </PhotoCreditsContext.Provider>
  );
}

export function usePhotoCredits() {
  const context = useContext(PhotoCreditsContext);
  if (context === undefined) {
    throw new Error(
      "usePhotoCredits must be used within a PhotoCreditsProvider",
    );
  }
  return context;
}
