import { useEffect, useRef, useState } from "react";

export type HandleObject<T> = {
  grab: () => T;
};

/**
 * Use a ref object that is guaranteed to be non-null.
 * @returns
 */
export const useNonnullHandleRef = <T>(): [
  React.RefObject<HandleObject<T>>,
  T | null
] => {
  const ref = useRef<HandleObject<T>>(null);
  const [val, setVal] = useState<T | null>(null);

  useEffect(() => {
    if (!ref.current) {
      throw new Error("Expected ref.current to be non-null");
    }

    setVal(ref.current.grab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, val];
};
