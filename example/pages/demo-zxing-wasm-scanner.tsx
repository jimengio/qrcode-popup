import React, { FC } from "react";
import { css } from "emotion";
import { DocDemo } from "@jimengio/doc-frame";
import ZxingWasmScanner from "../../src/zxing-wasm-scanner";

let DemoZxingWasmScanner: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <DocDemo title="Zxing Wasm">
        <ZxingWasmScanner
          onCodeDetected={(code) => {
            console.log("got code", JSON.stringify(code));
          }}
          zxingWasmPath="/wasm/zxing-go.wasm"
        />
      </DocDemo>
    </div>
  );
});

export default DemoZxingWasmScanner;
