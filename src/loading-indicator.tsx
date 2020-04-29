import React, { FC } from "react";
import { css, cx, keyframes } from "emotion";

const LoadingIndicator: FC<{
  className?: string;
  dotClassName?: string;
}> = React.memo((props) => {
  return (
    <div className={cx(styleSpinner, props.className)}>
      <div className={cx(styleBounce, props.dotClassName, styleB1)}></div>
      <div className={cx(styleBounce, props.dotClassName, styleB2)}></div>
      <div className={cx(styleBounce, props.dotClassName)}></div>
    </div>
  );
});

export default LoadingIndicator;

const styleSpinner = css`
  margin: 8px;
  width: 70px;
  text-align: center;
`;

const styleSkBounceDelay = keyframes`
  0%, 80%, 100% { transform: scale(0) }
  40% { transform: scale(1.0) }
`;

const styleBounce = css`
  width: 18px;
  height: 18px;
  background-color: #ccc;
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: ${styleSkBounceDelay} 1.4s infinite ease-in-out both;
  animation: ${styleSkBounceDelay} 1.4s infinite ease-in-out both;
`;

const styleB1 = css`
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
`;

const styleB2 = css`
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
`;
