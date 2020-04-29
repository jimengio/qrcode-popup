import React, { useEffect, useRef, useState, CSSProperties, useCallback } from "react";
import { useRafLoop } from "./util/use-raf-loop";

import { MultiFormatReader, BarcodeFormat, DecodeHintType, HTMLCanvasElementLuminanceSource, HybridBinarizer } from "@zxing/library";

const codeReader = new MultiFormatReader();
const jsHints = new Map();
const jsFormats = [BarcodeFormat.CODE_128, BarcodeFormat.QR_CODE];
// TODO: not sure about format: BarcodeFormat.UPC_EAN_EXTENSION
jsHints.set(DecodeHintType.POSSIBLE_FORMATS, jsFormats);
jsHints.set(DecodeHintType.TRY_HARDER, true);
codeReader.setHints(jsHints);

export type ZxingScannerState = { width?: number; height?: number };

export type ZxingScannerOptions = {
  className?: string;
  style?: CSSProperties;

  initState?: ZxingScannerState;

  onCodeDetected?: (code: string) => void;
  onScanFinish?: (info: { drawCost: number; scanCost: number; totalCost: number }) => void;
  onError?: (error: DOMError) => void;
};

export type ZxingScannerReturnResult = {
  loading: boolean;
  error: boolean;
  cameraHolder: React.ReactElement;
  onScan: () => void;
  onClose: () => void;
  cancelLoop: () => void;
  loopCalling: () => void;
};

const defaultState: ZxingScannerState = {
  width: 200,
  height: 200,
};

export function useStatefulZxingScanner(options: ZxingScannerOptions): ZxingScannerReturnResult {
  const { className, style, initState, onCodeDetected, onScanFinish, onError } = options;
  const refVideo = useRef<HTMLVideoElement>();
  const refCanvas = useRef<HTMLCanvasElement>();
  const streamRef = useRef<MediaStream>();

  const [state, setState] = useState<ZxingScannerState>(Object.assign({}, defaultState, initState));
  const [videoLoading, setVideoLoading] = useState(false);
  const [failedCamera, setFailedCamera] = useState(false);

  const performCodeScan = async () => {
    if (!videoLoading && refCanvas.current && streamRef.current && refVideo.current) {
      const scaledCanvas = refCanvas.current;
      const scaledContext = scaledCanvas.getContext("2d");
      const imageCapture = new window["ImageCapture"](streamRef.current.getTracks()[0]);

      const t0 = performance.now();
      scaledContext.clearRect(0, 0, state.width, state.height);

      const grabbedBitmap = await imageCapture.grabFrame();
      scaledContext.drawImage(grabbedBitmap, 0, 0, state.width, state.height, 0, 0, state.width, state.height);

      const t1 = performance.now();

      const luminanceSource = new HTMLCanvasElementLuminanceSource(scaledCanvas);
      const hybridBinarizer = new HybridBinarizer(luminanceSource);

      let t2: number;

      try {
        const result = codeReader.decode(hybridBinarizer as any, jsHints);

        t2 = performance.now();

        if (result != null && result.getText() != "") {
          onCodeDetected && onCodeDetected(result.getText());
          return;
        }
      } catch (error) {
        t2 = performance.now();

        onError && onError(new Error("Failed to decode."));
      }

      onScanFinish &&
        onScanFinish({
          drawCost: t1 - t0,
          scanCost: t2 - t1,
          totalCost: t2 - t0,
        });
    }
  };

  const { cancelLoop, loopCalling } = useRafLoop(
    () => {
      performCodeScan();
    },
    300,
    false
  );

  const onScan = useCallback(() => {
    if (window?.navigator?.mediaDevices && window?.screen) {
      setVideoLoading(true);

      window.navigator.mediaDevices
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

          const cameraSettings = stream.getTracks()[0].getSettings();

          // 检测手机竖屏状态, 需要宽高的处理
          if (window.screen.availWidth > window.screen.availHeight) {
            setState({
              width: cameraSettings.width,
              height: cameraSettings.height,
            });
          } else {
            setState({
              width: cameraSettings.height,
              height: cameraSettings.width,
            });
          }

          loopCalling();
        })
        .catch((error) => {
          setVideoLoading(false);
          setFailedCamera(true);

          if (onError) {
            onError(error);
          } else {
            throw error;
          }

          cancelLoop();
        });
    } else {
      setFailedCamera(true);
      onError && onError(new Error("window.navigator/screen undefined."));
    }
  }, []);

  const onClose = useCallback(() => {
    cancelLoop();
    streamRef.current?.getTracks()?.[0]?.stop();
    codeReader?.reset();
    if (refVideo.current) {
      refVideo.current.srcObject = undefined;
    }
    setVideoLoading(false);
    setFailedCamera(false);
  }, []);

  const handleVideoLoaded = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setVideoLoading(false);
  }, []);

  const handleImageErrored = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setVideoLoading(false);
  }, []);

  // unmount
  useEffect(() => onClose, [onClose]);

  const cameraHolder = (
    <>
      <video
        ref={refVideo}
        className={className}
        autoPlay
        style={{ width: state.width, height: state.height, ...style }}
        onLoadedData={handleVideoLoaded}
        onError={handleImageErrored}
      />
      <canvas ref={refCanvas} width={state.width} height={state.height} hidden />
    </>
  );

  return { loading: videoLoading, error: failedCamera, cameraHolder, onScan, onClose, cancelLoop, loopCalling };
}
