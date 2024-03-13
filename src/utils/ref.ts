import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type HandleObject<T> = {
  grab: () => T;
};

/**
 * Use a ref object that is guaranteed to be non-null.
 * @returns
 */
export const useNonnullInstanceRef = <T>(): [
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
  }, [ref.current]);

  return [ref, val];
};

/**
 * Uses a ref object to store an instance and provide it upwards to a parent
 * component. Exposes a matching state and setter function for use by the exposing
 * component.
 * @param ref The forwarded ref object to use, mandated by `React.forwardRef.
 * @returns
 */
export const useInstanceHandle = <T>(
  ref: React.ForwardedRef<HandleObject<T | null>>
): [T | null, (instance: T | null) => void] => {
  const instanceRef = useRef<T | null>(null);
  const [instance, setInstance] = useState<T | null>(null);
  useImperativeHandle(
    ref,
    () => ({
      grab: () => instanceRef.current,
    }),
    []
  );

  const set = useCallback((instance: T | null) => {
    setInstance(instance);
    instanceRef.current = instance;
  }, []);

  return [instance, set];
};
