import React, { FC, useState } from "react";
import { css } from "emotion";

import { useScannerEvents } from "../../src/scanner-events";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";

let DemoScannerEvents: FC<{ className?: string }> = React.memo((props) => {
  let [code, setCode] = useState("");

  useScannerEvents({
    onRevicedCode: (x) => {
      setCode(x);
    },
  });

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <DocDemo title={"Scanner Events"}>
        <div>{content}</div>
        <div>Code: {code || "-"}</div>
        <DocSnippet code={hooksCode} />
      </DocDemo>
    </div>
  );
});

export default DemoScannerEvents;

let content = `保持页面处在聚焦状态以便监听事件.`;

let hooksCode = `
useScannerEvents({
  onRevicedCode: (x) => {
    setCode(x);
  },
});
`;
