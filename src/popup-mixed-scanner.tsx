import React, { useState, ReactNode, useRef } from "react";
import { css } from "emotion";
import MixedScanner from "./mixed-scanner";

type FuncDetectedCode = (code: string, codeType: "qrcode" | "barcode") => void;

export let usePopupMixedScanner = (props: { onCodeDetected?: FuncDetectedCode }) => {
  // Model
  let [scanning, setScanning] = useState(false);

  let callbackRef = useRef(undefined as FuncDetectedCode);

  // Plugins

  // View

  let maxWidth = document.documentElement.clientWidth;
  let maxHeight = document.documentElement.clientHeight;

  let estimatedSize = Math.min(480, Math.min(maxWidth, maxHeight) - 32);

  let ui = scanning ? (
    <div className={styleContainer}>
      <MixedScanner
        className={styleScanner}
        width={estimatedSize}
        height={estimatedSize}
        onCodeDetected={(code, codeType) => {
          if (callbackRef.current != null) {
            callbackRef.current(code, codeType);
            callbackRef.current = null;
          }

          if (props.onCodeDetected != null) {
            props.onCodeDetected(code, codeType);
          }

          setScanning(false);
        }}
      />

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
    callbackRef.current = callback;
    setScanning(true);
  };

  return { ui, popup };
};

let styleContainer = css`
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
`;
