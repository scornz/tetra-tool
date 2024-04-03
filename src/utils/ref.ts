import React, {
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
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
 * Use a ref to hold an array of `HandleObject<T>` refs.
 * @returns A ref to the array of `HandleObject<T>` and a function to grab an instance by index.
 */
export const useNonnullInstanceRefsArray = <T>(
  length: number
): [React.RefObject<HandleObject<T>>[], (index: number) => T | undefined] => {
  const refs = useTypedRefsArray<T>(length);
  console.log(refs);

  // Function to grab an instance from a specific ref by index.
  const grabInstanceByIndex = useCallback(
    (index: number): T | undefined => {
      const ref = refs[index]?.current;
      console.log("trying? ", index, refs);
      if (ref) {
        console.log("grabbing instance", ref.grab());
      }

      return ref ? ref.grab() : undefined;
    },
    [refs]
  );

  return [refs, grabInstanceByIndex];
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

const useTypedRefsArray = <T>(
  length: number
): React.RefObject<HandleObject<T>>[] => {
  const refs = useMemo(() => {
    // Initialize an array of `length` with each element as a HandleObject<T> containing a ref.
    return Array.from({ length }, () => {
      const ref = React.createRef<HandleObject<T>>();
      return ref;
    });
  }, [length]);

  return refs;
};
