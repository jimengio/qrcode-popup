import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";

import MixedScanner from "../../src/mixed-scanner";

let DemoMixedScanner: FC<{}> = React.memo((props) => {
  let [code, setCode] = useState("");
  let [kind, setKind] = useState(null);

  let [scanCost, setScanCost] = useState(0);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={styleContainer}>
      <DocDemo title="Mixed Quagga2 and jsqr">
        <MixedScanner
          width={300}
          height={300}
          onScanFinish={(info) => {
            setScanCost(info.scanCost);
          }}
          onCodeDetected={(detected, codeKind) => {
            console.log("got code", JSON.stringify(detected));
            setCode(detected);
            setKind(codeKind);
          }}
        />
        <div>Cost: {scanCost || "-"}</div>
        <div>
          Scan result: {code} - {kind}
        </div>

        <DocSnippet code={exampleCode} />
      </DocDemo>
    </div>
  );
});

export default DemoMixedScanner;

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
