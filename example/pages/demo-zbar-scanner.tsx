import React, { FC } from "react";
import { css } from "emotion";
import { DocDemo } from "@jimengio/doc-frame";
import ZbarScanner from "../../src/zbar-scanner";

let DemoZbarScanner: FC<{}> = React.memo((props) => {
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title="Zbar Scanner">
        <ZbarScanner />
      </DocDemo>
    </div>
  );
});

export default DemoZbarScanner;
