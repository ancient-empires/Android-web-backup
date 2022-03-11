import Observer from './observers/observer.js';

import browserIsSupported, {hasWebSqlSupport, isMobile}
  from './check_browser.js';
import initFullscreenSettings, {getFullscreenStatus,
  setFullscreenStatus} from './observers/fullscreen_settings.js';
import initGameIframeObservers, {GAMES, GAME_URLS, GameIframeObserver}
  from './observers/game_runner.js';

import './custom_elements/init.js';
import {MAIN_ID, WEB_SQL_UNSUPPORTED_POPUP_ID,
  NOT_MOBILE_USER_AGENT_POPUP_ID, FULLSCREEN_SETTINGS_TOGGLE_ID,
  AE1_GAME_IFRAME_ID, AE2_GAME_IFRAME_ID}
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
  // check browser support
  // set visibility of popups & main element
  document.getElementById(WEB_SQL_UNSUPPORTED_POPUP_ID).hidden =
    hasWebSqlSupport();
  document.getElementById(NOT_MOBILE_USER_AGENT_POPUP_ID).hidden =
    isMobile();
  document.getElementById(MAIN_ID).hidden = !browserIsSupported();

  // initialize observers for AE1 and AE2
  const ae1IframeObserver = new GameIframeObserver(
      document.getElementById(AE1_GAME_IFRAME_ID),
      GAME_URLS[GAMES.AE1]);
  const ae2IframeObserver = new GameIframeObserver(
      document.getElementById(AE2_GAME_IFRAME_ID),
      GAME_URLS[GAMES.AE2]);
  initGameIframeObservers(ae1IframeObserver, ae2IframeObserver);

  // show warning message before unloading
  window.addEventListener('beforeunload',
      GameIframeObserver.showWarningBeforeUnload);

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
