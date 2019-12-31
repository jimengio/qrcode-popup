import React, { FC } from "react";
import { css, cx } from "emotion";
import { fullscreen, row, expand } from "@jimengio/flex-styles";

import Home from "./home";
import Content from "./content";
import { HashRedirect, findRouteTarget } from "@jimengio/ruled-router/lib/dom";
import { genRouter, GenRouterTypeMain } from "controller/generated-router";
import { ISidebarEntry, DocSidebar } from "@jimengio/doc-frame";

let items: ISidebarEntry[] = [];

const renderChildPage = (routerTree: GenRouterTypeMain) => {
  switch (routerTree?.name) {
    case "home":
      return <Home />;
    case "content":
      return <Content />;
    default:
      return (
        <HashRedirect to={genRouter.home.name} delay={2}>
          2s to redirect
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
        title="Workflow"
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
`;
