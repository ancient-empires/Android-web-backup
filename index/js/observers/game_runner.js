import Observer from './observer.js';

import {addToSet, removeFromSet} from '../helpers/sets.js';

/**
 * @readonly @enum {string}
 * Use this class in order to avoid directly using string literals
 * of game names.
 */
export const GAMES = Object.freeze({
  AE1: 'ae1',
  AE2: 'ae2',
});

/** @readonly */
export const GAME_URLS = Object.freeze({
  [GAMES.AE1]: '/AE1/www',
  [GAMES.AE2]: '/AE2/www',
});

/** @type { Object.<string, Set<Observer>> } */
export const gameStatusObservers = Object.freeze({
  [GAMES.AE1]: new Set(),
  [GAMES.AE2]: new Set(),
});

/** @type { Object.<string, ?HTMLIFrameElement> } */
export const gameIframes = Object.seal({
  [GAMES.AE1]: null,
  [GAMES.AE2]: null,
});

/** @type { Proxy<Object.<string, boolean>> } */
const gameRunningStatusProxy = new Proxy(Object.seal({
  [GAMES.AE1]: false,
  [GAMES.AE2]: false,
}), {
  set: /** @return { boolean } */
    (target, prop, value) => {
      value = Boolean(value);
      return Reflect.set(target, prop, value) &&
        (() => {
          Observer.publishTo(gameStatusObservers[prop], value);
          return true;
        })();
    },
});

/**
 * Get number of games running.
 * @return { number }
 */
export const getNumRunningGames = () => {
  return Object.keys(gameRunningStatusProxy).reduce(
      /**
       * @param { number } prevVal
       * @param { string } currVal
       * @return { number } the value that will be prevVal
       *   in the next iteration.
       */
      (prevVal, currVal) => {
        return prevVal + (gameRunningStatusProxy[currVal] ? 1 : 0);
      }, 0);
};

/**
 * Get game running status.
 * @param { GAMES } game the game to get running status for.
 * @return { boolean } `true` if the game is running, `false` if not.
 */
export const getGameRunningStatus = (game) => {
  return gameRunningStatusProxy[game];
};

/**
 * Set game running status.
 * @param { GAMES } game the game to set running status for.
 * @param { boolean } status `true` to start the game,
 *  `false` to end the game.
 */
export const setGameRunningStatus = (game, status) => {
  gameRunningStatusProxy[game] = status;
};

/**
 * Start the game.
 * @param { GAMES } game the game to start.
 */
export const startGame = (game) => {
  setGameRunningStatus(game, true);
};

/**
 * End the game.
 * @param { GAMES } game the game to end.
 */
export const endGame = (game) => {
  setGameRunningStatus(game, false);
};

/**
 * Add game status observers.
 * @param { GAMES } game the game to add observers to.
 * @param { ...Observer } observers observers to add.
 */
export const addGameStatusObservers = (game, ...observers) => {
  addToSet(gameStatusObservers[game], ...observers);
};

/**
 * Remove game status observers.
 * @param { GAMES } game the game to remove observers from.
 * @param { ...Observer } observers observers to remove.
 */
export const removeGameStatusObservers = (game, ...observers) => {
  removeFromSet(gameStatusObservers[game], ...observers);
};

/**
 * Set the `<iframe>` element corresponding to each game.
 *
 * After setting the iframe, you can use:
 * * `requestFullscreen` to display the game in fullscreen mode.
 * * `reloadGame` to reload the game.
 *
 * @param { GAMES } game the game to set the `<iframe>` element.
 * @param { ?HTMLIFrameElement } iframe the iframe to set.
 */
export const setGameIframe = (game, iframe) => {
  gameIframes[game] = iframe;
};

/**
 * Request the `<iframe>` element corresponding to the game to be
 * displayed in fullscreen.
 * @param { GAMES } game the game to display in fullscreen.
 */
export const requestFullscreen = (game) => {
  gameIframes[game]?.requestFullscreen();
};

/**
 * Reload the game in the corresponding `<iframe>` element.
 * @param { GAMES } game the game to reload.
 */
export const reloadGame = (game) => {
  if (window.confirm(`Are you sure to reload the game?
The progress of your currently playing level will be LOST!`)) {
    gameIframes[game]?.contentWindow.location.reload();
  }
};
