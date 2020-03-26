import React, { FC, useEffect, useRef, useState } from "react";
import { css } from "emotion";
import useInterval from "use-interval";
import jqQR from "jsqr";
import Quagga from "@ericblade/quagga2";

let MixedScanner: FC<{
  width?: number;
  height?: number;
  onCodeDetected: (code: string, kind: "barcode" | "qrcode") => void;
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
      context.drawImage(refVideo.current, 0, 0, canvasEl.width, canvasEl.height);
      let imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height);

      // console.log(imageData);

      let detectQrCode = jqQR(imageData.data, canvasEl.width, canvasEl.height);
      if (detectQrCode != null) {
        props.onCodeDetected(detectQrCode.data, "qrcode");
        return;
      }

      Quagga.decodeSingle(
        {
          src: canvasEl.toDataURL(),
          numOfWorkers: 0,
          inputStream: {
            size: canvasEl.width,
          },
          decoder: {
            readers: ["code_128_reader"], // List of active readers
          },
        },
        (result) => {
          if (result?.codeResult != null) {
            props.onCodeDetected(result.codeResult.code, "barcode");
          }
        }
      );
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

  useInterval(() => {
    if (refHasVideo.current) {
      let context = refCanvas.current.getContext("2d");
      context.drawImage(refVideo.current, 0, 0, refCanvas.current.width, refCanvas.current.height);

      let now = Date.now();

      if (now - refLastScanTime.current > 600) {
        performCodeScan();
        refLastScanTime.current = now;
      }
    }
  }, 120);

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

export default MixedScanner;

let styleContainer = css`
  background-color: hsl(0, 0%, 98%);
`;

let styleVideo = css`
  /* visibility: hidden; */
  display: none;
  width: 100px;
  height: 100px;
`;
