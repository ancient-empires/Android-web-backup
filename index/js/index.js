import Observer from "./observer.js";

import checkBrowserSupport from "./check_browser.js";
import initMainUi from "./main_ui.js";
import initFullscreenSettings, { getFullscreenStatus, setFullscreenStatus } from "./fullscreen_settings.js";

import { MAIN_ID, FULLSCREEN_SETTINGS_TOGGLE_ID } from "./key_element_ids.js";

/**
 * Initialize the UI for index.html.
 * First check browser support.
 * Then show main element if the browser supports running the game.
 * @returns { boolean }
 */
const initIndexUi = () => {
  // check browser support
  const browserIsSupported = checkBrowserSupport();

  // if browser is supported, then show main element
  // otherwise, hide the main element
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

  return browserIsSupported;
};

class FullscreenCheckboxObserver extends Observer {
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

  /** @param { Event } e */
  static inputListener(e) {
    setFullscreenStatus(Boolean(e.target.checked));
  }
}

/**
 * Initialize fullscreen settings.
 * @returns { boolean }
 */
const initFullscreen = () => {
  // use the checkbox on the page to set fullscreen status
  const checkbox = document.getElementById(FULLSCREEN_SETTINGS_TOGGLE_ID);
  // add a checkbox observer to sync with the page's fullscreen settings
  const checkboxObserver = new FullscreenCheckboxObserver(checkbox);

  initFullscreenSettings(checkboxObserver);

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  return initIndexUi() && initFullscreen();
});