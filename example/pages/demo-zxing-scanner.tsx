import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";

import ZxingScanner from "../../src/zxing-scanner";

let DemoZxingScanner: FC<{}> = React.memo((props) => {
  let [code, setCode] = useState("");
  let [kind, setKind] = useState(null);

  let [totalCost, setTotalCost] = useState(0);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={styleContainer}>
      <DocDemo title="Mixed Quagga2 and jsqr">
        <ZxingScanner
          onCodeDetected={(detected, codeKind) => {
            console.log("got code", JSON.stringify(detected));
            setCode(detected);
            setKind(codeKind);
          }}
          onScanFinish={(info) => {
            setTotalCost(info.totalCost);
          }}
        />
        <div>Time cost: {totalCost} </div>
        <div>
          Scan result: {code} - {kind}
        </div>

        <DocSnippet code={exampleCode} />
      </DocDemo>
    </div>
  );
});

export default DemoZxingScanner;

let styleContainer = css``;

let exampleCode = `
<MixedScanner
  width={300}
  height={300}
  onCodeDetected={(detected, codeKind) => {
    setCode(detected);
    setKind(codeKind);
  }}
/>

`;
