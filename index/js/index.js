import Observer from "./observer.js";

import checkBrowserSupport from "./check_browser.js";
import initMainUi from "./main_ui.js";
import initFullscreenSettings, { getFullscreenStatus, setFullscreenStatus } from "./fullscreen_settings.js";

import { MAIN_ID, FULLSCREEN_SETTINGS_TOGGLE_ID } from "./key_element_ids.js";

const init = () => {
    (() => {
        // check browser support
        const browserIsSupported = checkBrowserSupport();

        // if browser is supported, then show main element
        if (browserIsSupported) {
            const mainElement = document.getElementById(MAIN_ID);
            const mainElementObserver = new class MainElementObserver extends Observer {
                /** @param { HTMLElement } mainElement */
                constructor(mainElement) {
                    super();
                    this.mainElement = mainElement;
                }

                /** @override */
                receive(value) {
                    mainElement.hidden = !value;
                }
            }(mainElement);

            initMainUi(browserIsSupported, mainElementObserver);
        }

        return browserIsSupported;
    })() && (() => {
        // initialize fullscreen settings

        // use the checkbox to set fullscreen status
        const checkbox = document.getElementById(FULLSCREEN_SETTINGS_TOGGLE_ID);
        const checkboxObserver = new class FullscreenCheckboxObserver extends Observer {
            /** @param { HTMLInputElement } checkbox */
            constructor(checkbox) {
                super();

                this.checkbox = checkbox;

                checkbox.checked = getFullscreenStatus();
                checkbox.addEventListener("input", FullscreenCheckboxObserver.inputListener);
            }

            /** @override */
            receive(value) {
                this.checkbox.checked = Boolean(value);
            }

            static inputListener(e) {
                setFullscreenStatus(Boolean(e.target.checked));
            }
        }(checkbox);

        initFullscreenSettings(checkboxObserver);

        return true;
    })();
};

document.addEventListener("DOMContentLoaded", init);