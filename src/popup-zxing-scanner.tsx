import React, { useState, ReactNode, useRef, useEffect } from "react";
import { css } from "emotion";
import ZxingScanner from "./zxing-scanner";

type FuncDetectedCode = (code: string, codeType: "qrcode" | "barcode") => void;

export let usePopupZxingScanner = (props: {
  errorLocale?: string;
  /** 预览扫码结果时长 */
  previewTime?: number;
  onCodeDetected?: FuncDetectedCode;
}) => {
  // Model
  let [scanning, setScanning] = useState(false);
  let [tempResult, setTempResult] = useState(null);

  let callbackRef = useRef(undefined as FuncDetectedCode);

  // Plugins

  // Effects

  useEffect(() => {
    let listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setScanning(false);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  // View

  let maxWidth = document.documentElement.clientWidth;
  let maxHeight = document.documentElement.clientHeight;

  let estimatedSize = Math.min(480, Math.min(maxWidth, maxHeight) - 32);

  let ui = scanning ? (
    <div className={styleContainer}>
      <div className={styleScanner}>
        <ZxingScanner
          width={estimatedSize}
          height={estimatedSize}
          errorLocale={props.errorLocale}
          showStaticImage={tempResult != null}
          onCodeDetected={(code, codeType) => {
            setTempResult(code);

            setTimeout(() => {
              if (callbackRef.current != null) {
                callbackRef.current(code, codeType);
                callbackRef.current = null;
              }

              if (props.onCodeDetected != null) {
                props.onCodeDetected(code, codeType);
              }

              setScanning(false);
            }, props.previewTime || 800);
          }}
        />
        {tempResult != null ? <div className={styleTempResult}>{tempResult}</div> : null}
      </div>

      <div
        className={styleClose}
        onClick={() => {
          setScanning(false);
        }}
      >
        ✕
      </div>
    </div>
  ) : null;

  // Controller
  let popup = (callback?: FuncDetectedCode) => {
    setTempResult(null);
    setScanning(true);
    callbackRef.current = callback;
  };

  return { ui, popup };
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
  margin-top: 20%;
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
