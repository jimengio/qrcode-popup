import React, { FC, useEffect, useRef, useState } from "react";

import { useStatefulZxingScanner } from "./use-stateful-zxing-scanner";

let ZxingScanner: FC<{
  /** 参考值, 内部按照 Video 适配 */

  onCodeDetected: (code: string) => void;
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
  let scanner = useStatefulZxingScanner(props);

  useEffect(() => {
    scanner.onScan();
    return () => {
      scanner.onClose();
    };
  }, []);

  return scanner.cameraHolder;
});

export default ZxingScanner;
