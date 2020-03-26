import { useEffect, useRef } from "react";

const noop = () => {};

/** add Raf for performance reasons, mainly the structure of use-interval */
export let useRafLoop = (callback: () => void, delay: number) => {
  const savedCallback = useRef(noop);
  let refTimeout = useRef<number>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  let loopCalling = () => {
    refTimeout.current = window.setTimeout(() => {
      savedCallback.current();

      requestAnimationFrame(() => {
        loopCalling();
      });
    }, delay);
  };

  // Set up the interval.
  useEffect(() => {
    loopCalling();

    return () => clearTimeout(refTimeout.current);
  }, [delay]);
};
