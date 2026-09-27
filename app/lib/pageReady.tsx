"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ReadyContext = createContext<{
  ready: boolean;
  setModelReady: (v: boolean) => void;
}>({
  ready: false,
  setModelReady: () => {},
});

export function PageReadyProvider({ children }: { children: React.ReactNode }) {
  const [fontsReady, setFontsReady] = useState(false);
  const [modelReady, setModelReady] = useState(true); // assume ready unless a page says otherwise

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  return (
    <ReadyContext.Provider
      value={{ ready: fontsReady && modelReady, setModelReady }}
    >
      {children}
    </ReadyContext.Provider>
  );
}

export const usePageReady = () => useContext(ReadyContext);
