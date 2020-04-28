import { useEffect, useRef, useCallback } from "react";

const noop = () => {};

/** add Raf for performance reasons, mainly the structure of use-interval */
export const useRafLoop = (callback: () => void, delay: number, autoLoop = true): { cancelLoop: () => void; loopCalling: () => void } => {
  const savedCallback = useRef(noop);
  const refTimeout = useRef<number>();

  const cancelLoop = useCallback(() => {
    clearTimeout(refTimeout.current);
  }, []);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  const loopCalling = useCallback(() => {
    // let initialTime = performance.now();
    requestAnimationFrame(() => {
      refTimeout.current = window.setTimeout(() => {
        // let callingTime = performance.now();
        // console.log("loop wait time", callingTime - initialTime);
        savedCallback.current();

        loopCalling();
      }, delay);
    });
  }, [delay]);

  // Set up the interval.
  useEffect(() => {
    autoLoop && loopCalling();
  }, [autoLoop, loopCalling]);

  // unmount
  useEffect(() => cancelLoop, [cancelLoop]);

  return { cancelLoop, loopCalling };
};
