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
  /** 默认 400 */
  width?: number;
  /** 默认 400 */
  height?: number;
  onCodeDetected: (code: string, kind: "barcode" | "qrcode") => void;
  onError?: (error: DOMError) => void;
  className?: string;
  errorClassName?: string;

  /** 间隔该时长, 进行一次渲染, 默认 100 */
  renderInterval?: number;
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

  let width = props.width || 400;
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

      // TODO, 通过 Effects 加载 wasm 模块

      if (window["zxingScanCode"]) {
        let result: string = window["zxingScanCode"](canvasEl.width, canvasEl.height, new Uint8Array(imageData.data));
        if (result != null && result.trim() != "") {
          props.onCodeDetected(result, null);
        }
      } else {
        console.warn("zxing wasm scanner not ready");
      }
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
    if (failedCamera) {
      return;
    }

    if (props.showStaticImage) {
      // 展示已有的图像, 不再更新
      return;
    }
    if (refHasVideo.current) {
      let context = refCanvas.current.getContext("2d");

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

      // context.drawImage(refVideo.current, 0, 0, refCanvas.current.width, refCanvas.current.height);

      // 用于参考居中配置
      // context.drawImage(refVideo.current, 0, 0, 200, 200);

      let now = Date.now();
      let passedMs = now - refLastScanTime.current;
      let scanInterval = props.scanInterval ?? 600;

      // TODO, hint lines
      // context.strokeStyle = `hsla(0,80%,100%, ${Math.min(1, passedMs / scanInterval) * 60}%)`;
      // context.lineWidth = 8;
      // context.strokeRect(0, 0, width, height);

      if (passedMs > scanInterval) {
        performCodeScan();
        refLastScanTime.current = now;
      }
    }
  }, props.renderInterval ?? 100);

  useEffect(() => {
    const go = new window["Go"]();

    async function run() {
      await go.run(inst);
      inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance

      console.log("finished");
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

  /** Renderers */

  let errorLocale = props.errorLocale || "Failed to access to camera(HTTPS and permissions required)";

  if (failedCamera) {
    return <div className={cx(styleFailed, props.errorClassName)}>{errorLocale}</div>;
  }

  return (
    <>
      <video ref={refVideo} className={styleVideo} autoPlay />
      <canvas ref={refCanvas} className={cx(styleContainer, props.className)} width={width} height={height} />
    </>
  );
});

export default ZxingWasmScanner;

let styleContainer = css`
  background-color: hsl(0, 0%, 0%);
`;

let styleVideo = css`
  /* visibility: hidden; */
  display: none;
  width: 100px;
  height: 100px;
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
