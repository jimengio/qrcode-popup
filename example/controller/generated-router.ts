import queryString from "query-string";

type Id = string;

function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: any }) {
  return queryString.stringify(queries, { arrayFormat: "bracket" });
}

// generated

// Generated with router-code-generator@0.2.5

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
  $: {
    name: "home";
    params: {};
    query: {};
    next: null;
  };
}
