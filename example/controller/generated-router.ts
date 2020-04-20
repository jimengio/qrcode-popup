import queryString from "query-string";

type Id = string;

function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: any }) {
  return queryString.stringify(queries, { arrayFormat: "bracket" });
}

// generated

// Generated with router-code-generator@0.2.6

export let genRouter = {
  qrCode: {
    name: "qr-code",
    raw: "qr-code",
    path: () => `/qr-code`,
    go: () => switchPath(`/qr-code`),
  },
  barcode: {
    name: "barcode",
    raw: "barcode",
    path: () => `/barcode`,
    go: () => switchPath(`/barcode`),
  },
  zbarScanner: {
    name: "zbar-scanner",
    raw: "zbar-scanner",
    path: () => `/zbar-scanner`,
    go: () => switchPath(`/zbar-scanner`),
  },
  mixedScanner: {
    name: "mixed-scanner",
    raw: "mixed-scanner",
    path: () => `/mixed-scanner`,
    go: () => switchPath(`/mixed-scanner`),
  },
  mixedScannerPopup: {
    name: "mixed-scanner-popup",
    raw: "mixed-scanner-popup",
    path: () => `/mixed-scanner-popup`,
    go: () => switchPath(`/mixed-scanner-popup`),
  },
  zxingScanner: {
    name: "zxing-scanner",
    raw: "zxing-scanner",
    path: () => `/zxing-scanner`,
    go: () => switchPath(`/zxing-scanner`),
  },
  zxingScannerPopup: {
    name: "zxing-scanner-popup",
    raw: "zxing-scanner-popup",
    path: () => `/zxing-scanner-popup`,
    go: () => switchPath(`/zxing-scanner-popup`),
  },
  fileMixedScanner: {
    name: "file-mixed-scanner",
    raw: "file-mixed-scanner",
    path: () => `/file-mixed-scanner`,
    go: () => switchPath(`/file-mixed-scanner`),
  },
  zxingWasmScanner: {
    name: "zxing-wasm-scanner",
    raw: "zxing-wasm-scanner",
    path: () => `/zxing-wasm-scanner`,
    go: () => switchPath(`/zxing-wasm-scanner`),
  },
  zxingWasmScannerPopup: {
    name: "zxing-wasm-scanner-popup",
    raw: "zxing-wasm-scanner-popup",
    path: () => `/zxing-wasm-scanner-popup`,
    go: () => switchPath(`/zxing-wasm-scanner-popup`),
  },
  scannerEvents: {
    name: "scanner-events",
    raw: "scanner-events",
    path: () => `/scanner-events`,
    go: () => switchPath(`/scanner-events`),
  },
  $: {
    name: "home",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};

export type GenRouterTypeMain =
  | GenRouterTypeTree["qrCode"]
  | GenRouterTypeTree["barcode"]
  | GenRouterTypeTree["zbarScanner"]
  | GenRouterTypeTree["mixedScanner"]
  | GenRouterTypeTree["mixedScannerPopup"]
  | GenRouterTypeTree["zxingScanner"]
  | GenRouterTypeTree["zxingScannerPopup"]
  | GenRouterTypeTree["fileMixedScanner"]
  | GenRouterTypeTree["zxingWasmScanner"]
  | GenRouterTypeTree["zxingWasmScannerPopup"]
  | GenRouterTypeTree["scannerEvents"]
  | GenRouterTypeTree["$"];

export interface GenRouterTypeTree {
  qrCode: {
    name: "qr-code";
    params: {};
    query: {};
    next: null;
  };
  barcode: {
    name: "barcode";
    params: {};
    query: {};
    next: null;
  };
  zbarScanner: {
    name: "zbar-scanner";
    params: {};
    query: {};
    next: null;
  };
  mixedScanner: {
    name: "mixed-scanner";
    params: {};
    query: {};
    next: null;
  };
  mixedScannerPopup: {
    name: "mixed-scanner-popup";
    params: {};
    query: {};
    next: null;
  };
  zxingScanner: {
    name: "zxing-scanner";
    params: {};
    query: {};
    next: null;
  };
  zxingScannerPopup: {
    name: "zxing-scanner-popup";
    params: {};
    query: {};
    next: null;
  };
  fileMixedScanner: {
    name: "file-mixed-scanner";
    params: {};
    query: {};
    next: null;
  };
  zxingWasmScanner: {
    name: "zxing-wasm-scanner";
    params: {};
    query: {};
    next: null;
  };
  zxingWasmScannerPopup: {
    name: "zxing-wasm-scanner-popup";
    params: {};
    query: {};
    next: null;
  };
  scannerEvents: {
    name: "scanner-events";
    params: {};
    query: {};
    next: null;
  };
  $: {
    name: "home";
    params: {};
    query: {};
    next: null;
  };
}
