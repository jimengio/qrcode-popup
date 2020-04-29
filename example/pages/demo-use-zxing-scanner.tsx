import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { useStatefulZxingScanner } from "../../src/use-stateful-zxing-scanner";

const DemoUseStatefulZxingScanner: FC<{}> = React.memo((props) => {
  const [result, setResult] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  const { loading, error, onScan, onClose, cameraHolder, loopCalling, cancelLoop } = useStatefulZxingScanner({
    onCodeDetected: (code) => {
      console.log(code);
      setResult(code);
    },
    onScanFinish: (info) => {
      setTotalCost(info.totalCost);
    },
  });

  return (
    <div>
      <DocDemo title={"Mixed Scanner Popup"}>
        <button
          onClick={() => {
            onScan();
          }}
        >
          onScan
        </button>
        <button
          onClick={() => {
            onClose();
          }}
        >
          onClose
        </button>
        <div>Cost: {totalCost}</div>
        <div>Result: {result || "-"}</div>
        <div>loading: {`${loading}`}</div>
        <div>error: {`${error}`}</div>

        <DocSnippet code={exampleCode} />
      </DocDemo>
      {cameraHolder}
    </div>
  );
});

export default DemoUseStatefulZxingScanner;

let exampleCode = `
const { loading, error, onScan, onClose, cameraHolder, loopCalling, loopCancel } = useStatefulZxingScanner({
  onCodeDetected: (code) => {
    console.log(code);
    setResult(code);
  },
  onScanFinish: (info) => {
    setTotalCost(info.totalCost);
  },
});
`;
