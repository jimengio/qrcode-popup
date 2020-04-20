/**
 * WIP, not available
 */

import React, { FC, useEffect, useRef, useState } from "react";
import { css } from "emotion";
import { useRafLoop } from "./util/use-raf-loop";
// import Scanner from "zbar.wasm";

let ZbarScanner: FC<{
  width?: number;
  height?: number;
  onCodeDetected: (code: any[], kind: "barcode" | "qrcode" | "unsure") => void;
}> = React.memo((props) => {
  let refVideo = useRef<HTMLVideoElement>();
  let refCanvas = useRef<HTMLCanvasElement>();
  let refScanner = useRef(undefined);
  let refHasVideo = useRef(false);

  let refLastScanTime = useRef(0);

  /** Plugins */
  /** Methods */

  let performCodeScan = () => {
    if (refHasVideo.current && refCanvas.current) {
      let canvasEl = refCanvas.current;
      let context = canvasEl.getContext("2d");
      let imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height);

      // console.log(imageData);

      if (refScanner.current != null) {
        let result = refScanner.current.scanQrcode(imageData.data);
        if (result.length > 0) {
          props.onCodeDetected(result, "unsure");
        }
      }
    }
  };

  /** Effects */

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        refVideo.current.srcObject = stream;
        refHasVideo.current = true;
      })
      .catch((error) => {
        console.error("Failed to capture video", error);
      });
  }, []);

  useRafLoop(() => {
    if (refHasVideo.current) {
      let context = refCanvas.current.getContext("2d");
      context.drawImage(refVideo.current, 0, 0, refCanvas.current.width, refCanvas.current.height);

      let now = Date.now();

      if (now - refLastScanTime.current > 500) {
        performCodeScan();
        refLastScanTime.current = now;
      }
    }
  }, 120);

  useEffect(() => {
    (async () => {
      // let scanner = await Scanner({
      //   locateFile: (file) => "wasm/zbar.wasm",
      // });
      // refScanner.current = scanner;
    })();
  }, []);

  /** Renderers */

  let width = props.width || 660;
  let height = props.height || 400;

  return (
    <>
      <video ref={refVideo} className={styleVideo} controls autoPlay />
      <canvas ref={refCanvas} className={styleContainer} width={width} height={height} />
    </>
  );
});

export default ZbarScanner;

let styleContainer = css`
  background-color: hsl(0, 0%, 98%);
`;

let styleVideo = css`
  /* visibility: hidden; */
  display: none;
  width: 100px;
  height: 100px;
`;
