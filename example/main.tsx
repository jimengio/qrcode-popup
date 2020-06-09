import ReactDOM from "react-dom";
import React from "react";

import "main.css";

import { parseRoutePath } from "@jimengio/ruled-router";

import { routerRules } from "./models/router-rules";

import Container from "./pages/container";

// 提供 Go runtime 相关代码
import "../src/zxing-wasm-scanner/go-wasm-exec";

const renderApp = () => {
  let routerTree = parseRoutePath(window.location.hash.slice(1), routerRules);

  ReactDOM.render(<Container router={routerTree as any} />, document.querySelector(".app"));
};

window.onload = renderApp;

window.addEventListener("hashchange", () => {
  renderApp();
});

declare var module: any;

if (module.hot) {
  module.hot.accept(["./pages/container"], () => {
    renderApp();
  });
}
