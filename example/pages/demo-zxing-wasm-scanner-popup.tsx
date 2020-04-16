import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { usePopupZxingWasmScanner } from "../../src/popup-zxing-wasm-scanner";

let DemoMixedScannerPopup: FC<{}> = React.memo((props) => {
  let [result, setResult] = useState("");

  /** Plugins */

  let popupScanner = usePopupZxingWasmScanner({
    errorLocale: "扫码错误: 无法获取相机图像 无法获取相机图像(可能是因为没有 HTTPS 权限)",
    zxingWasmPath: "wasm/zxing-go.wasm",
    onCodeDetected: (code, codeType) => {
      console.log(code, codeType);
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
            popupScanner.popup((code, codeType) => {
              console.log("got code", JSON.stringify(code));
              setResult(code);
            });
          }}
        >
          Scan
        </button>
        <div>Result: {result || "-"}</div>

        <DocSnippet code={exampleCode} />
      </DocDemo>

      {popupScanner.ui}
    </div>
  );
});

export default DemoMixedScannerPopup;

let exampleCode = `
let popupScanner = usePopupMixedScanner({
  onCodeDetected: (code, codeType) => {
    console.log(code, codeType);
  },
});

popupScanner.ui // UI Part

popupScanner.popup((code, codeType) => {
  console.log("got code", code, codeType);
});
`;
