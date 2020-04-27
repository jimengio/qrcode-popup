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

      if (event.key === "Enter" || event.key === "Tab") {
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

    // 目前已知的扫描枪事件有的型号以 Enter 结尾, 有的以 Tab 结尾, 对 Tab 做一些特殊处理
    let onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        listener(event);
        event.preventDefault(); // prevent from blur
      }
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keypress", listener);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keypress", listener);
    };
  }, []);
};
