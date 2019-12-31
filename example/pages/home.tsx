import React from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { HashLink } from "@jimengio/ruled-router/lib/dom";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        Home Page
        <HashLink to={genRouter.content.path()} text={"Open content"} className={styleButton} />
        <a
          onClick={async () => {
            let { showTime } = await import("../util/time" /* webpackChunkName:"time" */);
            showTime();
          }}
        >
          Use
        </a>
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
