import { useEffect, useRef } from "react";

// scanner events emits around every 10ms based on observations, picking a larger number
let largerInterval = 40;

export let useScannerEvents = (props: { onRevicedCode: (code: string) => void }) => {
  let refCode = useRef("");
  let refLastCodeTime = useRef(0);

  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      let now = performance.now();

      // console.log("code interval", now - refLastCodeTime.current);
      if (now - refLastCodeTime.current > largerInterval) {
        refCode.current = "";
      }

      if (event.key === "Enter") {
        props.onRevicedCode(refCode.current);
        refCode.current = "";
      } else if (event.key.length === 1) {
        if (event.key.match(/^[a-zA-Z0-9\-\.\s\$\+\%\*]$/)) {
          refCode.current = `${refCode.current}${event.key}`;
        } else {
          console.warn("Unknown code:", event.key, event);
        }
      } else {
        console.warn("Unknown keystroke:", event.key, event);
      }

      refLastCodeTime.current = now;
    };

    window.addEventListener("keypress", listener);

    return () => {
      window.removeEventListener("keypress", listener);
    };
  }, []);
};
