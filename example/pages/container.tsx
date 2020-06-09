import React, { FC } from "react";
import { css, cx } from "emotion";
import { fullscreen, row, expand } from "@jimengio/flex-styles";

import { HashRedirect, findRouteTarget } from "@jimengio/ruled-router/lib/dom";
import { genRouter, GenRouterTypeTree } from "controller/generated-router";
import { ISidebarEntry, DocSidebar } from "@jimengio/doc-frame";
import DemoBarcodePopup from "./demo-barcode-popup";
import DemoQRCodePopup from "./demo-qrcode-popup";
import DemoZbarScanner from "./demo-zbar-scanner";
import DemoMixedScanner from "./demo-mixed-scanner";
import DemoMixedScannerPopup from "./demo-mixed-scanner-popup";
import DemoZxingScanner from "./demo-zxing-scanner";
import DemoUseStatefulZxingScanner from "./demo-use-zxing-scanner";
import DemoZxingScannerPopup from "./demo-zxing-scanner-popup";
import DemoFileMixedScanner from "./demo-file-mixed-scanner";
import DemoZxingWasmScanner from "./demo-zxing-wasm-scanner";
import DemoZxingWasmScannerPopup from "./demo-zxing-wasm-scanner-popup";
import DemoScannerEvents from "./demo-scanner-events";

let items: ISidebarEntry[] = [
  {
    title: "QR Code",
    path: genRouter.qrCode.name,
  },
  {
    title: "Barcode",
    path: genRouter.barcode.name,
  },
  {
    title: "Mixed Scanner",
    path: genRouter.mixedScanner.name,
  },
  {
    title: "Mixed Scanner Popup",
    path: genRouter.mixedScannerPopup.name,
  },
  {
    title: "Zxing Scanner",
    path: genRouter.zxingScanner.name,
  },
  {
    title: "useStatefulZxingScanner",
    path: genRouter.useStatefulZxingScanner.name,
  },

  {
    title: "Zxing Scanner Popup",
    path: genRouter.zxingScannerPopup.name,
  },
  {
    title: "File Mixed Scanner",
    path: genRouter.fileMixedScanner.name,
  },
  {
    title: "Zxing Wasm Scanner",
    path: genRouter.zxingWasmScanner.name,
  },
  {
    title: "Zxing Wasm Scanner Popup",
    path: genRouter.zxingWasmScannerPopup.name,
  },
  {
    title: "Scanner Events",
    path: genRouter.scannerEvents.name,
  },
];

const renderChildPage = (routerTree: GenRouterTypeTree["next"]) => {
  switch (routerTree?.name) {
    case "qr-code":
      return <DemoQRCodePopup />;
    case "barcode":
      return <DemoBarcodePopup />;
    case "zbar-scanner":
      return <DemoZbarScanner />;
    case "mixed-scanner":
      return <DemoMixedScanner />;
    case "mixed-scanner-popup":
      return <DemoMixedScannerPopup />;
    case "zxing-scanner":
      return <DemoZxingScanner />;
    case "use-stateful-zxing-scanner":
      return <DemoUseStatefulZxingScanner />;
    case "zxing-scanner-popup":
      return <DemoZxingScannerPopup />;
    case "file-mixed-scanner":
      return <DemoFileMixedScanner />;
    case "zxing-wasm-scanner":
      return <DemoZxingWasmScanner />;
    case "zxing-wasm-scanner-popup":
      return <DemoZxingWasmScannerPopup />;
    case "scanner-events":
      return <DemoScannerEvents />;
    default:
      return <HashRedirect to={genRouter.qrCode.path()} noDelay></HashRedirect>;
  }

  return <div>NOTHING</div>;
};

let onSwitchPage = (path: string) => {
  let target = findRouteTarget(genRouter, path);
  if (target != null) {
    target.go();
  }
};

let Container: FC<{ router: GenRouterTypeTree["next"] }> = React.memo((props) => {
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(fullscreen, expand, row, styleContainer)}>
      <DocSidebar
        title="QrCode Popup"
        currentPath={props.router.name}
        onSwitch={(item) => {
          onSwitchPage(item.path);
        }}
        items={items}
      />
      <div className={cx(expand, styleBody)}>{renderChildPage(props.router)}</div>
    </div>
  );
});

export default Container;

const styleContainer = css``;

let styleBody = css`
  padding: 16px;
  min-width: 400px;
`;
