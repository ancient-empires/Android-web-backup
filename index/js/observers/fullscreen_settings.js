import Observer from './observer.js';

const FULLSCREEN_LOCAL_STORAGE_KEY = 'enter-fullscreen-on-game-start';

/** @type { Set<Observer> } */
const fullscreenObservers = new Set();

/** Observer to observe fullscreen settings in local storage. */
class FullscreenLocalStorageObserver extends Observer {
  /** @override */
  receive(value) {
    if (value) {
      localStorage.setItem(FULLSCREEN_LOCAL_STORAGE_KEY, true);
    } else {
      localStorage.removeItem(FULLSCREEN_LOCAL_STORAGE_KEY);
    }
  }

  /**
   * @return { boolean } `true` if the user opts to start the game
   * in fullscreen mode, `false` otherwise.
   */
  static getFullscreenSettings() {
    return Boolean(localStorage.getItem(FULLSCREEN_LOCAL_STORAGE_KEY));
  }
}

// add local storage observer to remember if the user
// opts for starting game on fullscreen.
fullscreenObservers.add(new FullscreenLocalStorageObserver());

const fullscreenSettingsProxy = new Proxy(Object.seal({
  'shouldEnterFullscreenOnGameStart':
      FullscreenLocalStorageObserver.getFullscreenSettings(),
}), {
  set: /** @return { boolean } */ (target, prop, value) => {
    value = Boolean(value);
    return Reflect.set(target, prop, value) &&
      (() => {
        switch (prop) {
          default:
            break;
          case 'shouldEnterFullscreenOnGameStart':
            {
              fullscreenObservers.forEach((observer) => {
                observer.receive(value);
              });
            }
            break;
        }
        return true;
      })();
  },
});

/** @return { boolean } */
export const getFullscreenStatus = () =>
  fullscreenSettingsProxy.shouldEnterFullscreenOnGameStart;

/** @param { boolean } value */
export const setFullscreenStatus = (value) => {
  fullscreenSettingsProxy.shouldEnterFullscreenOnGameStart = value;
};

/**
 * Initialize fullscreen settings with additional observers.
 * @param { ...Observer } additionalObservers
 */
const initFullscreenSettings = (...additionalObservers) => {
  additionalObservers.forEach((observer) => {
    fullscreenObservers.add(observer);
  });
};

export default initFullscreenSettings;
