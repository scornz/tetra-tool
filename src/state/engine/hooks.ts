import { useContext } from "react";

import { EngineContext } from ".";
import { Engine } from "game/engine";

/**
 * Hook for retrieving the engine instance. Must be used within an EngineProvider.
 */
export const useEngine = (): Engine => {
  const instance = useContext(EngineContext);
  if (!instance)
    throw new Error("useEngine must be used within an EngineProvider.");

  return instance;
};
