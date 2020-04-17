import React, { FC, useEffect, useRef, useState } from "react";
import { css, cx } from "emotion";
import { useRafLoop } from "./util/use-raf-loop";

import { MultiFormatReader, BarcodeFormat, DecodeHintType, HTMLCanvasElementLuminanceSource, HybridBinarizer, BinaryBitmap } from "@zxing/library";

let codeReader = new MultiFormatReader();
let jsHints = new Map();
let jsFormats = [BarcodeFormat.CODE_128, BarcodeFormat.QR_CODE, BarcodeFormat.UPC_EAN_EXTENSION];
jsHints.set(DecodeHintType.POSSIBLE_FORMATS, jsFormats);
jsHints.set(DecodeHintType.TRY_HARDER, true);
codeReader.setHints(jsHints);

let ZxingScanner: FC<{
  /** 参考值, 内部按照 Video 适配 */

  onCodeDetected: (code: string, kind: "barcode" | "qrcode") => void;
  onError?: (error: DOMError) => void;
  className?: string;
  errorClassName?: string;
  scaledWidth?: number;

  /** 多次渲染累积超过该时长, 进行一次扫描, 默认 600 */
  scanInterval?: number;

  errorLocale?: string;

  /** 暂时关闭渲染 */
  showStaticImage?: boolean;
}> = React.memo((props) => {
  let refVideo = useRef<HTMLVideoElement>();
  let refCanvas = useRef<HTMLCanvasElement>();
  let refHasVideo = useRef(false);

  let [failedCamera, setFailedCamera] = useState(false);

  /** exprimental code for grabFrame */
  // let refImageCapture = useRef<any>();

  let [deviceSize, setDeviceSize] = useState({
    w: 200, // 设置比较小的初始值
    h: 200,
  });

  // console.log("deviceSize", deviceSize);

  // 显示区域的 width/height 注意不能超过 camera 返回的宽度高度

  // 默认放开到 800
  let scaledWidth = props.scaledWidth || 800;
  let scaledHeight = Math.round((scaledWidth / deviceSize.w) * deviceSize.h);

  /** Plugins */
  /** Methods */

  let performCodeScan = async () => {
    if (failedCamera) {
      return;
    }

    if (!refHasVideo.current || !refCanvas.current) {
      return;
    }

    let scaledCanvas = refCanvas.current;
    let scaledContext = scaledCanvas.getContext("2d");

    let t0 = performance.now();
    scaledContext.clearRect(0, 0, scaledWidth, scaledHeight);

    // console.log("drawing", 0, 0, deviceSize.w, deviceSize.h, 0, 0, scaledWidth, scaledHeight);
    scaledContext.drawImage(refVideo.current, 0, 0, deviceSize.w, deviceSize.h, 0, 0, scaledWidth, scaledHeight);

    let t1 = performance.now();
    // console.log("time cost for drawing", t1 - t0);

    let luminanceSource = new HTMLCanvasElementLuminanceSource(scaledCanvas);
    let hybridBinarizer = new HybridBinarizer(luminanceSource);

    // let grabbedBitmap = await refImageCapture.current.grabFrame();
    let bitmap = new BinaryBitmap(hybridBinarizer);

    // console.log("compare", grabbedBitmap, bitmap);

    try {
      let result = codeReader.decode(bitmap, jsHints);

      if (result != null && result.getText() != "") {
        props.onCodeDetected(result.getText(), null);
        return;
      }
    } catch (error) {
      console.log("failed to decode");
    }

    let t2 = performance.now();
    console.log("time cost for scanning", t2 - t1);
  };

  /** Effects */

  useEffect(() => {
    if (navigator.mediaDevices == null) {
      setFailedCamera(true);
      return;
    }
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          resizeMode: "none",
        },
        audio: false,
      })
      .then((stream) => {
        refVideo.current.srcObject = stream;

        // refImageCapture.current = new window["ImageCapture"](stream.getTracks()[0]);

        refHasVideo.current = true;
        let cameraSettings = stream.getTracks()[0].getSettings();

        if (window.screen.availWidth > window.screen.availHeight) {
          setDeviceSize({
            w: cameraSettings.width,
            h: cameraSettings.height,
          });
        } else {
          // 检测手机竖屏状态, 需要宽高的处理
          setDeviceSize({
            w: cameraSettings.height,
            h: cameraSettings.width,
          });
        }

        // console.log("set deviceSize", cameraSettings);
      })
      .catch((error) => {
        console.error(`Failed to request camera stream! (${error?.toString()})`);
        setFailedCamera(true);
        if (props.onError != null) {
          props.onError(error);
        } else {
          throw error;
        }
      });
  }, []);

  useRafLoop(() => {
    performCodeScan();
  }, 300);

  /** Renderers */

  let errorLocale = props.errorLocale || "Failed to access to camera(HTTPS and permissions required)";

  if (failedCamera) {
    return <div className={cx(styleFailed, props.errorClassName)}>{errorLocale}</div>;
  }

  // console.log("size", deviceSize, width, height);

  return (
    <>
      <video ref={refVideo} className={styleVideo} autoPlay style={{ width: deviceSize.w, height: deviceSize.h }} />
      <canvas ref={refCanvas} width={scaledWidth} height={scaledHeight} style={{ width: scaledWidth, height: scaledHeight }} className={styleCanvas} />
    </>
  );
});

export default ZxingScanner;

let styleVideo = css`
  /* display: none; */
`;

let styleFailed = css`
  background-color: #f5222d;
  color: white;
  padding: 12px 16px;
  font-size: 14px;
  margin: 10vw auto auto auto;
  max-width: 90vw;
  word-break: break-all;
  line-height: 21px;
`;

let styleCanvas = css`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  /* opacity: 0.8; */
  border: 1px solid red;
  pointer-events: none;
  display: none;
`;
