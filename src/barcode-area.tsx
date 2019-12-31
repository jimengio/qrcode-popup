import React, { useState, FC, useRef, useEffect, isValidElement } from "react";
import { css, cx } from "emotion";
import { row, center } from "@jimengio/shared-utils";

import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2";

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
        numOfWorkers: 0, // worker threads not working for now, disable it
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

export default BarcodeArea;

let styleVideoContainer = css`
  width: 100%;
  height: 100%;
`;

let styleVideo = css`
  width: 100%;
  height: 100%;
`;
