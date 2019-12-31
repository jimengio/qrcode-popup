import React, { useState, FC, useRef, useEffect, isValidElement } from "react";
import { css, cx } from "emotion";
import { row, center } from "@jimengio/shared-utils";

import { QuaggaJSStatic, QuaggaJSResultObject } from "@ericblade/quagga2";
import QuaggaLib from "@ericblade/quagga2/lib/quagga";

let Quagga: QuaggaJSStatic = QuaggaLib;

let hintError = () => {
  return `Current host ${location.host} is neither HTTPS nor localhost.`;
};

let BarcodeArea: FC<{
  onChange: (code: string, obj: QuaggaJSResultObject) => void;
  onProgress?: (obj: QuaggaJSResultObject) => void;
  onError: (error) => void;
  /** defaults to 120 */
  frequency?: number;
}> = (props) => {
  let videoElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: videoElementRef.current,
          constraints: {
            width: videoElementRef.current.offsetWidth,
            height: videoElementRef.current.offsetHeight,
            facingMode: "environment",
          },
        },
        locate: false,
        numOfWorkers: 0,
        frequency: props.frequency || 120,
        decoder: {
          readers: ["code_128_reader"],
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          if (props.onError) {
            props.onError(err);
          }
          return;
        }

        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      props.onChange(result.codeResult.code, result);
    });

    Quagga.onProcessed((result) => {
      props.onProgress?.(result);
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div className={cx(center, styleVideoContainer)}>
      <div className={styleVideo} ref={videoElementRef}></div>
    </div>
  );
};

let BarcodePopup: FC<{
  onDetect: (code: string) => void;
  delay?: number;
  onError?: (error) => void;
  cardClassName?: string;
}> = React.memo((props) => {
  let [isEditing, setEditing] = useState(false);
  let [scanError, setError] = useState(null);

  /** Plugins */

  /** Methods */

  /** Effects */

  /** Renderers */

  let renderEditor = () => {
    return (
      <div
        className={shellStylePopupBackground}
        onClick={(event) => {
          event.stopPropagation();
          setEditing(false);
        }}
      >
        <div
          className={cx(row, styleEditingArea, props.cardClassName)}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {isEditing ? (
            <BarcodeArea
              onChange={(code: string) => {
                props.onDetect(code);
                setEditing(false);
              }}
              onError={(error) => {
                console.error("Barcode error:", error);
                setError(error.toString());
                if (props.onError != null) {
                  props.onError(error);
                }
              }}
            />
          ) : null}

          {scanError != null ? (
            <div className={styleError}>
              <div>{scanError}</div>
              <div>{hintError()}</div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <span
      onClick={() => {
        setEditing(true);
      }}
    >
      {props.children || <a className={styleLink}>Click to scan QR code!</a>}

      {isEditing ? renderEditor() : null}
    </span>
  );
});

export default BarcodePopup;

const styleEditingArea = css`
  margin: auto;
  display: inline-flex;
  background-color: black;
  border: 8px solid #aaa;
  min-width: 320px;
  min-height: 320px;
  max-width: 640px;
  max-height: 640px;
  /* in case min() does not work */
  width: 640px;
  height: 640px;
  width: min(60vw, 60vh);
  height: min(60vw, 60vh);
  margin-top: 12vh;

  position: relative;
`;

const styleError = css`
  bottom: 0;
  left: 0%;
  position: absolute;
  padding: 16px;
  color: red;
  font-size: 16px;
  background-color: hsla(0, 0%, 20%, 0.9);
  z-index: 20;
`;

const styleClose = css`
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  z-index: 200;
  font-size: 16px;
`;

export const shellStylePopupBackground = css`
  position: fixed;
  min-height: 100px;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
  background-color: hsla(0, 0%, 0%, 0.6);
  padding-bottom: 5%;

  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

let styleLink = css`
  color: hsl(200, 80%, 50%);
  cursor: pointer;
`;

let styleVideoContainer = css`
  width: 100%;
  height: 100%;
`;

let styleVideo = css`
  width: 100%;
  height: 100%;
`;
