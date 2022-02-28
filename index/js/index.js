import checkBrowserSupport from "./check_browser.js";
import setMainUiVisibility from "./main_ui.js";
import initFullscreenSettings from "./fullscreen_settings.js";

const init = () => {
    (() => {
        const browserIsSupported = checkBrowserSupport();
        setMainUiVisibility(browserIsSupported);
        return browserIsSupported;
    })() && (() => {
        initFullscreenSettings();
        return true;
    })();
};

document.addEventListener("DOMContentLoaded", init);