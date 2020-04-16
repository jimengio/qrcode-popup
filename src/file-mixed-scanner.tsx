import React, { FC } from "react";
import { css } from "emotion";
import Quagga from "@ericblade/quagga2";

let FileMixedScanner: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <input
        type="file"
        onChange={(event) => {
          console.log(event.target.files);
          let fileReader = new FileReader();
          fileReader.onload = (readEvent) => {
            let img = document.createElement("image");

            Quagga.decodeSingle(
              {
                src: readEvent.target.result.toString(),
                numOfWorkers: 0,
                decoder: {
                  readers: ["code_128_reader", "ean_reader"], // List of active readers
                },
              },
              (result) => {
                console.log("code result", result);
                if (result?.codeResult != null) {
                  console.log(result.codeResult.code);
                }
              }
            );
          };
          fileReader.readAsDataURL(event.target.files[0]);
        }}
      />
    </div>
  );
});

export default FileMixedScanner;
