import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import BarcodePopup from "../../src/barcode-popup";
import { Space } from "@jimengio/flex-styles";

let DemoBarcodePopup: FC<{}> = React.memo((props) => {
  let [code, setCode] = useState(null);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title="Barcode">
        <div>Code is: {code || "-"}</div>
        <Space height={16} />
        <BarcodePopup
          onDetect={(code) => {
            setCode(code);
          }}
          onError={(error) => {
            console.error("Failed o intialize");
          }}
        ></BarcodePopup>

        <DocSnippet code={demoCode} />
      </DocDemo>
    </div>
  );
});

export default DemoBarcodePopup;

let demoCode = `
<BarcodePopup
  onDetect={(code) => {
    setCode(code);
  }}
  onError={(error) => {
    console.error("Failed o intialize");
  }}
></BarcodePopup>
`;
