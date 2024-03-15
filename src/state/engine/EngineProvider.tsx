import { Engine } from "@/game/engine";
import React, { createContext, useState, useEffect } from "react";

export const EngineContext = createContext<Engine | null>(null);

type Props = {
  children: React.ReactNode;
};

const EngineProvider = ({ children }: Props) => {
  const [engine, setEngine] = useState<Engine | null>(null);
  useEffect(() => {
    const newEngine = new Engine();
    setEngine(newEngine);
    return () => {
      // Destroy the new engine when the component unmounts
      newEngine.destroy();
    };
  }, []);

  return (
    <>
      {engine && (
        <EngineContext.Provider value={engine}>
          {children}
        </EngineContext.Provider>
      )}
    </>
  );
};

export default EngineProvider;
