import { IRouteRule } from "@jimengio/ruled-router";

export const routerRules: IRouteRule[] = [
  { path: "qr-code" },
  { path: "barcode" },
  { path: "zbar-scanner" },
  { path: "mixed-scanner" },
  { path: "mixed-scanner-popup" },
  { path: "zxing-scanner" },
  { path: "zxing-scanner-popup" },
  { path: "file-mixed-scanner" },
  { path: "zxing-wasm-scanner" },
  { path: "zxing-wasm-scanner-popup" },
  { path: "scanner-events" },
  { path: "", name: "home" },
];
