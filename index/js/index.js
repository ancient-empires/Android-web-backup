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

/** Initialize the UI for index.html */
const init = () => {
  (() => {
    // Step 1: Check browser support.

    document.getElementById(WEB_SQL_UNSUPPORTED_POPUP_ID).hidden =
    hasWebSqlSupport();
    document.getElementById(NOT_MOBILE_USER_AGENT_POPUP_ID).hidden =
    isMobile();

    const result = browserIsSupported();
    document.getElementById(MAIN_ID).hidden = !result;

    return result;
  })() && (() => {
    // Step 2: If the browser supports running the game, then
    // initialize the iframe observers.

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

    return true;
  })() && (() => {
    // Step 3: Initialize the fullscreen settings.

    const fullscreenCheckbox =
      document.getElementById(FULLSCREEN_SETTINGS_TOGGLE_ID);

    const fullscreenCheckboxObserver = new (
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
    )(fullscreenCheckbox);

    initFullscreenSettings(fullscreenCheckboxObserver);

    return true;
  })();
};

document.addEventListener('DOMContentLoaded', init);
