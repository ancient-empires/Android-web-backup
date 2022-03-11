import Observer from './observer.js';

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
    FullscreenBroadcastObserver.channel.postMessage(value);
  }

  /**
   * Broadcast message handler.
   * @param { MessageEvent } e the message event.
   */
  static broadcastMessageHandler(e) {
    setFullscreenStatus(Boolean(e.data));
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
    const oldValue = Reflect.get(target, prop);
    value = Boolean(value);
    return Reflect.set(target, prop, value) &&
      (() => {
        switch (prop) {
          default:
            break;
          case 'shouldEnterFullscreenOnGameStart':
            if (oldValue !== value) {
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
