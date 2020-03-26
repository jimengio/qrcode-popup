import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo } from "@jimengio/doc-frame";

import MixedScanner from "../../src/mixed-scanner";

let DemoMixedScanner: FC<{}> = React.memo((props) => {
  let [code, setCode] = useState("");
  let [kind, setKind] = useState(null);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      DEMO OF MIXED
      <DocDemo title="Mixed Quagga2 and jsqr">
        <MixedScanner
          onCodeDetected={(detected, codeKind) => {
            setCode(detected);
            setKind(codeKind);
          }}
        />
        <div>
          Scan result: {code} - {kind}
        </div>
      </DocDemo>
    </div>
  );
});

export default DemoMixedScanner;
