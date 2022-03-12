import Observer from './observers/observer.js';

import browserIsSupported, {hasWebSqlSupport, isMobile}
  from './check_browser.js';
import {getFullscreenSettings, setFullscreenSettings,
  addFullscreenObservers} from './observers/fullscreen_settings.js';
import {GAMES, GAME_URLS, getNumRunningGames, startGame,
  addGameStatusObservers, setGameIframe} from './observers/game_runner.js';

import './custom_elements/init.js';
import {MAIN_ID, WEB_SQL_UNSUPPORTED_POPUP_ID,
  NOT_MOBILE_USER_AGENT_POPUP_ID,
  AE1_START_GAME_ID, AE2_START_GAME_ID, FULLSCREEN_SETTINGS_TOGGLE_ID,
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

    /**
     * Game iframe observer.
     * Change the iframe URLs and update number of running games when
     * a game is started or ended.
    */
    class GameIframeObserver extends Observer {
      /** @constant */
      static BLANK_URL = 'about:blank';

      /**
       * Initialize a game iframe observer.
       * @param { HTMLIFrameElement } iframe the iframe in which
       *   to run the game.
       * @param { string } gameUrl the URL for the game.
       */
      constructor(iframe, gameUrl) {
        super();

        this.iframe = iframe;
        this.gameUrl = gameUrl;

        this.iframe.src = GameIframeObserver.BLANK_URL;
      }

      /** @return { boolean } */
      isRunning() {
        return this.iframe.src !== GameIframeObserver.BLANK_URL;
      }

      /** Start the game. */
      startGame() {
        if (!this.isRunning()) {
          this.iframe.src = this.gameUrl;
        }
      }

      /** Request to display the <iframe> in fullscreen mode. */
      requestFullscreen() {
        this.iframe.requestFullscreen();
      }

      /** End the game. */
      endGame() {
        if (this.isRunning()) {
          this.iframe.src = GameIframeObserver.BLANK_URL;
        }
      }

      /**
       * @override
       * @param { boolean } shouldStartGame
       *   `true` for instruction to start the game;
       *   `false` to end the game.
       */
      receive(shouldStartGame) {
        shouldStartGame ? this.startGame() : this.endGame();
      }

      /**
       * Show a warning when the user attempts to leave or refresh
       * the page, if there are any games still running.
       * @param { BeforeUnloadEvent } e
       * @return { ?string }
       */
      static showWarningBeforeUnload(e) {
        e.preventDefault();
        if (getNumRunningGames() > 0) {
          return e.returnValue = 'confirm';
        }
        return null;
      }
    }

    /** @type { HTMLIFrameElement[] } */
    const [ae1Iframe, ae2Iframe] = [
      document.getElementById(AE1_GAME_IFRAME_ID),
      document.getElementById(AE2_GAME_IFRAME_ID),
    ];

    // set game `<iframe>`s (so that the user may display them in
    // fullscreen mode)
    setGameIframe(GAMES.AE1, ae1Iframe);
    setGameIframe(GAMES.AE2, ae2Iframe);

    // initialize observers for AE1 and AE2
    const [ae1IframeObserver, ae2IframeObserver] = [
      new GameIframeObserver(ae1Iframe, GAME_URLS[GAMES.AE1]),
      new GameIframeObserver(ae2Iframe, GAME_URLS[GAMES.AE2]),
    ];
    addGameStatusObservers(GAMES.AE1, ae1IframeObserver);
    addGameStatusObservers(GAMES.AE2, ae2IframeObserver);

    // show warning message before unloading
    window.addEventListener('beforeunload',
        GameIframeObserver.showWarningBeforeUnload);

    return true;
  })() && (() => {
    // Step 3: Add click events on buttons to start the games.
    document.getElementById(AE1_START_GAME_ID).addEventListener(
        'click', () => startGame(GAMES.AE1));
    document.getElementById(AE2_START_GAME_ID).addEventListener(
        'click', () => startGame(GAMES.AE2));

    return true;
  })() && (() => {
    // Step 4: Initialize the fullscreen settings.

    const fullscreenCheckbox =
      document.getElementById(FULLSCREEN_SETTINGS_TOGGLE_ID);

    const fullscreenCheckboxObserver = new (
      class FullscreenCheckboxObserver extends Observer {
        /** @param { HTMLInputElement } checkbox */
        constructor(checkbox) {
          super();

          this.checkbox = checkbox;

          checkbox.checked = getFullscreenSettings();
          checkbox.addEventListener('input',
              FullscreenCheckboxObserver.inputListener);
        }

        /** @override */
        receive(value) {
          this.checkbox.checked = Boolean(value);
        }

        /** @param { Event } e */
        static inputListener(e) {
          setFullscreenSettings(Boolean(e.target.checked));
        }
      }
    )(fullscreenCheckbox);

    addFullscreenObservers(fullscreenCheckboxObserver);

    return true;
  })();
};

document.addEventListener('DOMContentLoaded', init);
