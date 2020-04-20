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
    // let initialTime = performance.now();
    requestAnimationFrame(() => {
      refTimeout.current = window.setTimeout(() => {
        // let callingTime = performance.now();
        // console.log("loop wait time", callingTime - initialTime);
        savedCallback.current();

        loopCalling();
      }, delay);
    });
  };

  // Set up the interval.
  useEffect(() => {
    loopCalling();

    return () => clearTimeout(refTimeout.current);
  }, [delay]);
};
