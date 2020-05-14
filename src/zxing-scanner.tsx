import React, { FC, useEffect, useRef, useState } from "react";
import { css, cx } from "emotion";
import { useRafLoop } from "./util/use-raf-loop";
import jqQR from "jsqr";
import Quagga from "@ericblade/quagga2";
import browserDetect from "browser-detect";

import { MultiFormatReader, BarcodeFormat, DecodeHintType, HTMLCanvasElementLuminanceSource, HybridBinarizer, BinaryBitmap } from "@zxing/library";

let codeReader = new MultiFormatReader();
let jsHints = new Map();
let jsFormats = [BarcodeFormat.CODE_128, BarcodeFormat.QR_CODE];
// TODO: not sure about format: BarcodeFormat.UPC_EAN_EXTENSION
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

  onScanFinish?: (info: { drawCost: number; scanCost: number; totalCost: number }) => void;
}> = React.memo((props) => {
  let refVideo = useRef<HTMLVideoElement>();
  let refCanvas = useRef<HTMLCanvasElement>();
  const streamRef = useRef<MediaStream>();
  let refHasVideo = useRef(false);

  let [failedCamera, setFailedCamera] = useState(false);

  /** exprimental code for grabFrame */

  let [deviceSize, setDeviceSize] = useState({
    w: 200, // 设置比较小的初始值
    h: 200,
  });

  // console.log("deviceSize", deviceSize);

  // 显示区域的 width/height 注意不能超过 camera 返回的宽度高度

  let scaledWidth = deviceSize.w;
  let scaledHeight = deviceSize.h;

  /** Plugins */
  /** Methods */

  let performZxingCodeScan = async () => {
    if (failedCamera) {
      return;
    }

    // let imageCapture = new window["ImageCapture"](streamRef.current.getTracks()[0]);

    if (!refHasVideo.current || !refCanvas.current || !refVideo.current) {
      return;
    }

    if (refCanvas.current.width < 1 || refCanvas.current.height < 1) {
      return;
    }

    let scaledCanvas = refCanvas.current;
    let scaledContext = scaledCanvas.getContext("2d");

    let t0 = performance.now();
    scaledContext.clearRect(0, 0, scaledWidth, scaledHeight);

    // let grabbedBitmap = await imageCapture.grabFrame();
    // console.log("drawing", 0, 0, deviceSize.w, deviceSize.h, 0, 0, scaledWidth, scaledHeight);
    scaledContext.drawImage(refVideo.current, 0, 0, refVideo.current.videoWidth, refVideo.current.videoHeight, 0, 0, scaledWidth, scaledHeight);

    // console.log(scaledWidth, scaledHeight, deviceSize, jsHints);

    let t1 = performance.now();
    // console.log("time cost for drawing", t1 - t0);

    let luminanceSource = new HTMLCanvasElementLuminanceSource(scaledCanvas);
    let hybridBinarizer = new HybridBinarizer(luminanceSource);

    // console.log("compare", grabbedBitmap, bitmap);

    let t2: number;

    try {
      /** CONFUSION: faster to pass hybridBinarizer directly */
      // let bitmap = new BinaryBitmap(hybridBinarizer);
      let result = codeReader.decode(hybridBinarizer as any, jsHints);

      t2 = performance.now();

      if (result != null && result.getText() != "") {
        props.onCodeDetected(result.getText(), null);
        return;
      }
    } catch (error) {
      console.log("failed to decode");
      t2 = performance.now();
    }

    if (props.onScanFinish) {
      props.onScanFinish({
        drawCost: t1 - t0,
        scanCost: t2 - t1,
        totalCost: t2 - t0,
      });
    }

    console.log("time cost for scanning", t2 - t1);
  };

  let performMixedCodeScan = async () => {
    if (refVideo.current && refCanvas.current) {
      let canvasEl = refCanvas.current;
      let context = canvasEl.getContext("2d");

      let t0 = performance.now();

      context.drawImage(refVideo.current, 0, 0, refVideo.current.videoWidth, refVideo.current.videoHeight, 0, 0, deviceSize.w, deviceSize.h);

      let imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height);

      const t1 = performance.now();

      // console.log(imageData);

      let detectQrCode = jqQR(imageData.data, canvasEl.width, canvasEl.height);
      if (detectQrCode != null) {
        let t2 = performance.now();
        if (props.onScanFinish != null) {
          props.onScanFinish({
            drawCost: t1 - t0,
            scanCost: t2 - t1,
            totalCost: t2 - t0,
          });
        }
        props.onCodeDetected(detectQrCode.data.trim(), null);
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
            readers: ["code_128_reader", "ean_reader"], // List of active readers
          },
        },
        (result) => {
          let t2 = performance.now();
          if (props.onScanFinish != null) {
            props.onScanFinish({ drawCost: t1 - t0, scanCost: t2 - t1, totalCost: t2 - t0 });
          }
          if (result?.codeResult != null) {
            props.onCodeDetected(result.codeResult.code.trim(), null);
          }
        }
      );
    }
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
        streamRef.current = stream;

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

        // Detect Safari problem and get sizes from video
        if (cameraSettings.width === 0) {
          setTimeout(() => {
            // console.log("settings", cameraSettings, refVideo.current.videoWidth, refVideo.current);
            if (window.screen.availWidth > window.screen.availHeight) {
              setDeviceSize({
                w: refVideo.current.videoWidth,
                h: refVideo.current.videoHeight,
              });
            } else {
              // 检测手机竖屏状态, 需要宽高的处理
              setDeviceSize({
                w: refVideo.current.videoHeight,
                h: refVideo.current.videoWidth,
              });
            }
          }, 100);
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

    return () => {
      streamRef.current?.getTracks()?.[0]?.stop();
      codeReader?.reset();
    };
  }, []);

  useRafLoop(() => {
    let info = browserDetect();
    if (info.mobile && info.name === "safari") {
      performMixedCodeScan();
    } else {
      performZxingCodeScan();
    }
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
