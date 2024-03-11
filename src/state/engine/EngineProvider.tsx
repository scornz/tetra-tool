import { Engine } from "@/game/engine";
import React, { createContext, useState, useEffect } from "react";

export const EngineContext = createContext<Engine | null>(null);

type Props = {
  children: React.ReactNode;
};

const EngineProvider = ({ children }: Props) => {
  const [engine] = useState<Engine>(new Engine());
  useEffect(() => {
    return () => {
      // Destroy the new engine when the component unmounts
      engine.destroy();
    };
  }, [engine]);

  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
};

export default EngineProvider;
