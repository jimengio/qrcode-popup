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

  let width = props.width || 660;
  let height = props.height || 400;

  let [deviceSize, setDeviceSize] = useState({
    w: width,
    h: height,
  });

  let refLastScanTime = useRef(0);

  /** Plugins */
  /** Methods */

  let performCodeScan = () => {
    if (refHasVideo.current && refCanvas.current) {
      let canvasEl = refCanvas.current;
      let context = canvasEl.getContext("2d");
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
        let cameraSettings = stream.getTracks()[0].getSettings();

        setDeviceSize({
          w: cameraSettings.width,
          h: cameraSettings.height,
        });
      })
      .catch((error) => {
        console.error("Failed to capture video", error);
      });
  }, []);

  useInterval(() => {
    if (refHasVideo.current) {
      let context = refCanvas.current.getContext("2d");
      // context.drawImage(refVideo.current, 0, 0, refCanvas.current.width, refCanvas.current.height);

      if (width <= deviceSize.w && height <= deviceSize.h) {
        context.drawImage(refVideo.current, (width - deviceSize.w) * 0.5, (height - deviceSize.h) * 0.5, deviceSize.w, deviceSize.h);
      } else if (width / height < deviceSize.w / deviceSize.h) {
        let scaledDeviceHeight = height;
        let scaledDeviceWidth = deviceSize.w * (height / deviceSize.h);
        context.drawImage(refVideo.current, (width - scaledDeviceWidth) * 0.5, 0, scaledDeviceWidth, scaledDeviceHeight);
      } else {
        // height > device.h
        let scaledDeviceWidth = width;
        let scaledDeviceHeight = deviceSize.h * (width / deviceSize.w);
        context.drawImage(refVideo.current, 0, (height - scaledDeviceHeight) * 0.5, scaledDeviceWidth, scaledDeviceHeight);
      }

      // 用于参考居中配置
      // context.drawImage(refVideo.current, 0, 0, 200, 200);

      let now = Date.now();

      if (now - refLastScanTime.current > 600) {
        performCodeScan();
        refLastScanTime.current = now;
      }
    }
  }, 120);

  /** Renderers */

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
