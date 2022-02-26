import checkBrowserSupport from "./check_browser.js";
import { setMainUiVisibility } from "./main_ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const browserIsSupported = checkBrowserSupport();
    setMainUiVisibility(browserIsSupported);
});