import React, { FC, useEffect, useRef, useState } from "react";
import { css, cx } from "emotion";
import jqQR from "jsqr";
import Quagga from "@ericblade/quagga2";
import { useRafLoop } from "./util/use-raf-loop";

// 提供 Go runtime 相关代码
import "./zxing-wasm-scanner/go-wasm-exec";

if (!WebAssembly.instantiateStreaming) {
  // polyfill
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

let ZxingWasmScanner: FC<{
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

  /** 动态加载 wasm 文件的地址 */
  zxingWasmPath: string;
}> = React.memo((props) => {
  let refVideo = useRef<HTMLVideoElement>();
  let refCanvas = useRef<HTMLCanvasElement>();
  let refHasVideo = useRef(false);

  let [failedCamera, setFailedCamera] = useState(false);

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

  let performCodeScan = () => {
    if (failedCamera) {
      return;
    }

    if (!refHasVideo.current || !refCanvas.current) {
      return;
    }

    if (window["zxingScanCode"] == null) {
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

    let scaledImageData = scaledContext.getImageData(0, 0, scaledWidth, scaledHeight);
    let result: string = window["zxingScanCode"](scaledWidth, scaledHeight, new Uint8Array(scaledImageData.data));

    if (result != null && result.trim() != "") {
      props.onCodeDetected(result, null);
      return;
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

  useEffect(() => {
    const go = new window["Go"]();

    async function run() {
      await go.run(inst);
      inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance

      console.log("Finished loading wasm...");
    }

    let mod, inst;
    WebAssembly.instantiateStreaming(fetch(props.zxingWasmPath), go.importObject)
      .then((result) => {
        mod = result.module;
        inst = result.instance;
        run();
      })
      .catch((err) => {
        console.error(err);
      });
  });

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

export default ZxingWasmScanner;

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
