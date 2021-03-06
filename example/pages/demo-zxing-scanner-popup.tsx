import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { usePopupZxingScanner } from "../../src/popup-zxing-scanner";

let DemoMixedScannerPopup: FC<{}> = React.memo((props) => {
  let [result, setResult] = useState("");
  let [totalCost, setTotalCost] = useState(0);

  /** Plugins */

  let popupScanner = usePopupZxingScanner({
    errorLocale: "扫码错误: 无法获取相机图像 无法获取相机图像(可能是因为没有 HTTPS 权限)",
    onCodeDetected: (code) => {
      console.log(code);
    },
    onScanFinish: (info) => {
      setTotalCost(info.totalCost);
    },
  });

  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title={"Mixed Scanner Popup"}>
        <button
          onClick={() => {
            popupScanner.popup((code) => {
              console.log("got code", JSON.stringify(code));
              setResult(code);
            });
          }}
        >
          Scan
        </button>
        <div>Cost: {totalCost}</div>
        <div>Result: {result || "-"}</div>

        <DocSnippet code={exampleCode} />
      </DocDemo>

      {popupScanner.ui}
    </div>
  );
});

export default DemoMixedScannerPopup;

let exampleCode = `
let popupScanner = usePopupZxingScanner({
  onCodeDetected: (code) => {
    console.log(code);
  },
});

popupScanner.ui // UI Part

popupScanner.popup((code) => {
  console.log("got code", code, codeType);
});
`;
