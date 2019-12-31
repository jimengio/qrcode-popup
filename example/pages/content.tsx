import React from "react";
import { css } from "emotion";
import { genRouter } from "controller/generated-router";
import { HashLink } from "@jimengio/ruled-router/lib/dom";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        Content Page
        <HashLink to={genRouter.home.path()} className={styleButton} text={"Back to home"} />
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
