import browserDetect from "browser-detect";

export let isSafari = () => {
  let info = browserDetect();
  if (info.name === "safari") {
    return true;
  }
  return false;
};
