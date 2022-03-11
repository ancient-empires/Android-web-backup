import Observer from './observer.js';
import {addToSet, removeFromSet} from '../helpers/sets.js';

const FULLSCREEN_LOCAL_STORAGE_KEY = 'enter-fullscreen-on-game-start';

/** @type { Set<Observer> } */
const fullscreenObservers = new Set();

/** Observer to observe fullscreen settings in local storage. */
class FullscreenLocalStorageObserver extends Observer {
  /**
   * @override
   * @param { boolean } value `true` for setting fullscreen,
   *   `false` for un-setting fullscreen.
   */
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

/** Observer to broadcast fullscreen settings to other tabs/windows. */
class FullscreenBroadcastObserver extends Observer {
  static curr =
    FullscreenLocalStorageObserver.getFullscreenSettings();

  /** @constant */
  static CHANNEL_NAME = 'fullscreen';

  /** @readonly */
  static channel = new BroadcastChannel(
      FullscreenBroadcastObserver.CHANNEL_NAME);

  /**
   * @override
   * @param { boolean } value `true` for setting fullscreen,
   *   `false` for un-setting fullscreen.
   */
  receive(value) {
    value = Boolean(value);
    if (FullscreenBroadcastObserver.curr !== value) {
      FullscreenBroadcastObserver.curr = value;
      FullscreenBroadcastObserver.channel.postMessage(value);
    }
  }

  /**
   * Broadcast message handler.
   * @param { MessageEvent } e the message event.
   */
  static broadcastMessageHandler(e) {
    setFullscreenSettings(Boolean(e.data));
  }
}

FullscreenBroadcastObserver.channel.addEventListener('message',
    FullscreenBroadcastObserver.broadcastMessageHandler);

fullscreenObservers.add(new FullscreenLocalStorageObserver());
fullscreenObservers.add(new FullscreenBroadcastObserver());

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
            Observer.publishTo(fullscreenObservers, value);
        }
        return true;
      })();
  },
});

/** @return { boolean } */
export const getFullscreenSettings = () =>
  fullscreenSettingsProxy.shouldEnterFullscreenOnGameStart;

/** @param { boolean } value */
export const setFullscreenSettings = (value) => {
  fullscreenSettingsProxy.shouldEnterFullscreenOnGameStart = value;
};

/**
 * Add fullscreen observers.
 * @param { ...Observer } observers observers to add.
 */
export const addFullscreenObservers = (...observers) => {
  addToSet(fullscreenObservers, ...observers);
};

/**
 * Remove specified fullscreen observers.
 * @param { ...Observer } observers observers to remove.
 */
export const removeFullscreenObservers = (...observers) => {
  removeFromSet(fullscreenObservers, ...observers);
};
