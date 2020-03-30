import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo } from "@jimengio/doc-frame";
import ZbarScanner from "../../src/zbar-scanner";

let DemoZbarScanner: FC<{}> = React.memo((props) => {
  let [code, setCode] = useState("");
  let [kind, setKind] = useState(null);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title="Zbar Scanner">
        <ZbarScanner
          onCodeDetected={(detected, kind) => {
            setCode(JSON.stringify(detected));
            setKind(kind);
          }}
        />
        <div>
          Result: {code} - {kind}
        </div>
      </DocDemo>
    </div>
  );
});

export default DemoZbarScanner;
