import {navigateToTopHash} from './helpers.js';

import Observer from './observers/observer.js';

import initCheckBrowserSupport,
{WebSqlSupportObserver, IsMobileObserver}
  from './observers/check_browser.js';
import initFullscreenSettings, {getFullscreenStatus,
  setFullscreenStatus} from './observers/fullscreen_settings.js';
import initMainUi from './observers/main_ui.js';

import './custom_elements/init.js';
import {MAIN_ID, WEB_SQL_UNSUPPORTED_POPUP_ID,
  NOT_MOBILE_USER_AGENT_POPUP_ID, FULLSCREEN_SETTINGS_TOGGLE_ID}
  from './key_element_ids.js';

/**
 * Initialize the UI for index.html.
 * First check browser support.
 * Then show main element if the browser supports running the game.
 *
 * @return { boolean } `true` if browser supports running the game,
 * `false` otherwise.
 */
const initIndexUi = () => {
  // ensure that we always get the Welcome page
  // when the user opens it (hash should be discarded)
  navigateToTopHash(true);

  // check browser support
  const webSqlSupportObserver = new WebSqlSupportObserver(
      document.getElementById(WEB_SQL_UNSUPPORTED_POPUP_ID));
  const isMobileObserver = new IsMobileObserver(
      document.getElementById(NOT_MOBILE_USER_AGENT_POPUP_ID));
  const browserIsSupported = initCheckBrowserSupport(
      webSqlSupportObserver, isMobileObserver);

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

/** Sync full screen checkbox status with settings. */
class FullscreenCheckboxObserver extends Observer {
  /** @param { HTMLInputElement } checkbox */
  constructor(checkbox) {
    super();

    this.checkbox = checkbox;

    checkbox.checked = getFullscreenStatus();
    checkbox.addEventListener('input',
        FullscreenCheckboxObserver.inputListener);
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
 * @return { boolean } `true`
 */
const initFullscreen = () => {
  // use the checkbox on the page to set fullscreen status
  const checkbox = document.getElementById(FULLSCREEN_SETTINGS_TOGGLE_ID);
  // add a checkbox observer to sync with the page's fullscreen settings
  const checkboxObserver = new FullscreenCheckboxObserver(checkbox);

  initFullscreenSettings(checkboxObserver);

  return true;
};

document.addEventListener('DOMContentLoaded', () => {
  return initIndexUi() && initFullscreen();
});
