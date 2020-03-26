import React, { FC } from "react";
import { css, cx } from "emotion";
import { fullscreen, row, expand } from "@jimengio/flex-styles";

import { HashRedirect, findRouteTarget } from "@jimengio/ruled-router/lib/dom";
import { genRouter, GenRouterTypeMain } from "controller/generated-router";
import { ISidebarEntry, DocSidebar } from "@jimengio/doc-frame";
import DemoBarcodePopup from "./demo-barcode-popup";
import DemoQRCodePopup from "./demo-qrcode-popup";
import DemoZbarScanner from "./demo-zbar-scanner";
import DemoMixedScanner from "./demo-mixed-scanner";

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
    title: "Zbar Scanner",
    path: genRouter.zbarScanner.name,
  },
  {
    title: "Mixed Scanner",
    path: genRouter.mixedScanner.name,
  },
];

const renderChildPage = (routerTree: GenRouterTypeMain) => {
  switch (routerTree?.name) {
    case "qr-code":
      return <DemoQRCodePopup />;
    case "barcode":
      return <DemoBarcodePopup />;
    case "zbar-scanner":
      return <DemoZbarScanner />;
    case "mixed-scanner":
      return <DemoMixedScanner />;
    default:
      return (
        <HashRedirect to={genRouter.qrCode.path()} delay={1}>
          1s to redirect
        </HashRedirect>
      );
  }

  return <div>NOTHING</div>;
};

let onSwitchPage = (path: string) => {
  let target = findRouteTarget(genRouter, path);
  if (target != null) {
    target.go();
  }
};

let Container: FC<{ router: GenRouterTypeMain }> = React.memo((props) => {
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <DocSidebar
        title="QrCode Popup"
        currentPath={props.router.name}
        onSwitch={(item) => {
          console.log("switch");
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
`;
