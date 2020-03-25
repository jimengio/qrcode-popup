import React, { FC, useEffect, useRef, useState } from "react";
import { css } from "emotion";
import Scanner from "zbar.wasm";
import useInterval from "use-interval";

let ZbarScanner: FC<{
  width?: number;
  height?: number;
}> = React.memo((props) => {
  let refVideo = useRef<HTMLVideoElement>();
  let refCanvas = useRef<HTMLCanvasElement>();
  let refScanner = useRef(undefined);
  let refHasVideo = useRef(false);

  /** Plugins */
  /** Methods */
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

      let imageData = context.getImageData(0, 0, refCanvas.current.width, refCanvas.current.height);

      // console.log();

      if (refScanner.current != null) {
        let result = refScanner.current.scanQrcode(imageData);
        if (result.length > 0) {
          console.log(result);
        }
      }
    }
  }, 130);

  useEffect(() => {
    (async () => {
      let scanner = await Scanner({
        locateFile: (file) => "/wasm/zbar.wasm",
      });
      refScanner.current = scanner;
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
