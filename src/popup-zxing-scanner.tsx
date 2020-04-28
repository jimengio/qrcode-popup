import React, { useState, ReactNode, useRef, useEffect, useCallback } from "react";
import { css, cx } from "emotion";
import { useZxingScanner, ZxingScannerOptions } from "./use-zxing-scanner";

import LoadingIndicator from "./loading-indicator";

const DefaultErrorLocale = "Failed to access to camera(HTTPS and permissions required)";

export let usePopupZxingScanner = (props: {
  errorLocale?: string;
  errorClassName?: string;

  /** 预览扫码结果时长 */
  previewTime?: number;
  onCodeDetected?: ZxingScannerOptions["onCodeDetected"];
  onScanFinish?: ZxingScannerOptions["onScanFinish"];
  onError?: ZxingScannerOptions["onError"];
}) => {
  const { errorLocale, errorClassName, previewTime = 800, onCodeDetected, onScanFinish, onError } = props;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Model
  const [scanning, setScanning] = useState(false);
  const [tempResult, setTempResult] = useState(null);

  const callbackRef = useRef<ZxingScannerOptions["onCodeDetected"]>();

  const onCodeDetectedEvent = (code) => {
    setTempResult(code);

    loopCancel();

    timerRef.current = setTimeout(() => {
      if (callbackRef.current != null) {
        callbackRef.current(code);
        callbackRef.current = null;
      }

      onCodeDetected && onCodeDetected(code);

      setScanning(false);
      onClose();
    }, previewTime);
  };

  const { loading, error, cameraHolder, onScan, onClose, loopCancel } = useZxingScanner({
    onScanFinish,
    onError,
    onCodeDetected: onCodeDetectedEvent,
  });

  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setScanning(false);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = undefined;
    };
  }, []);

  const ui = scanning ? (
    <div className={styleContainer}>
      {loading && <LoadingIndicator className={styleLoading} />}
      <div className={styleScanner}>
        {error && <div className={cx(styleFailed, errorClassName)}>{errorLocale || DefaultErrorLocale}</div>}
        {cameraHolder}
        {tempResult != null ? <div className={styleTempResult}>{tempResult}</div> : null}
      </div>

      <div
        className={styleClose}
        onClick={() => {
          onClose();
          setScanning(false);
        }}
      >
        ✕
      </div>
    </div>
  ) : null;

  // Controller
  const popup = useCallback((callback?: ZxingScannerOptions["onCodeDetected"]) => {
    setTempResult(null);
    setScanning(true);
    onScan();
    callbackRef.current = callback;
  }, []);

  const close = useCallback(() => {
    setScanning(false);
    onClose();
  }, []);

  return { ui, popup, close };
};

let styleContainer = css`
  z-index: 200; /* same as barcode popup */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);

  display: flex;
`;

let styleClose = css`
  position: fixed;
  top: 16px;
  right: 16px;
  font-size: 24px;
  cursor: pointer;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
`;

let styleScanner = css`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
  margin-top: min(80px, 20%);
  margin-bottom: auto;
  position: relative;
`;

let styleTempResult = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  font-size: 20px;
  text-align: center;
  font-family: Source Code Pro, Menlo, Roboto Mono, Consolas, monospace;
  color: white;
  background-color: hsl(0, 0%, 0%, 0.4);
`;

const styleFailed = css`
  background-color: #f5222d;
  color: white;
  padding: 12px 16px;
  font-size: 14px;
  margin: 10vw auto auto auto;
  max-width: 90vw;
  word-break: break-all;
  line-height: 21px;
`;

const styleLoading = css`
  position: fixed;
  top: 40%;
  left: 0;
  right: 0;
  margin: auto;
`;
