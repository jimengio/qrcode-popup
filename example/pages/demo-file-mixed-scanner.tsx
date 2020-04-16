import React, { FC } from "react";
import { css } from "emotion";
import { DocDemo } from "@jimengio/doc-frame";
import FileMixedScanner from "../../src/file-mixed-scanner";

let DemoFileMixedScanner: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <DocDemo title={"Demo file mixed scanner"}>
        <FileMixedScanner />
      </DocDemo>
    </div>
  );
});

export default DemoFileMixedScanner;
