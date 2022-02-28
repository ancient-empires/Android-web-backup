import Observer from "./observer.js";

const FULLSCREEN_LOCAL_STORAGE_KEY = "enter-fullscreen-on-game-start";

/** @type { Set<Observer> } */
const fullscreenObservers = new Set();

class FullscreenLocalStorageObserver extends Observer {
    constructor() {
        super();
    }

    /** @override */
    receive(value) {
        if (value) {
            localStorage.setItem(FULLSCREEN_LOCAL_STORAGE_KEY, true);
        } else {
            localStorage.removeItem(FULLSCREEN_LOCAL_STORAGE_KEY);
        }
    }

    /** @returns { boolean } */
    static getFullscreenStatus() {
        return Boolean(localStorage.getItem(FULLSCREEN_LOCAL_STORAGE_KEY));
    }
}

// add local storage observer to remember if the user opts for starting game on fullscreen
fullscreenObservers.add(new FullscreenLocalStorageObserver());

const fullscreenSettingsProxy = new Proxy({
    "shouldEnterFullscreenOnGameStart": FullscreenLocalStorageObserver.getFullscreenStatus()
}, {
    set: /** @returns { boolean } */ (target, prop, value) => {
        return Reflect.has(target, prop)
            && Reflect.set(target, prop, Boolean(value))
            && (() => {
                switch (prop) {
                    default:
                        break;
                    case "shouldEnterFullscreenOnGameStart":
                        {
                            fullscreenObservers.forEach((observer) => {
                                observer.receive(Boolean(value));
                            })
                        }
                        break;
                }
                return true;
            })();
    }
});

/** @returns { boolean } */
export const getFullscreenStatus = () => fullscreenSettingsProxy.shouldEnterFullscreenOnGameStart;

/** @param { boolean } value */
export const setFullscreenStatus = (value) => {
    fullscreenSettingsProxy.shouldEnterFullscreenOnGameStart = value;
}

/**
 * Initialize fullscreen settings with additional observers.
 * @param { Observer[] additionalObservers }
 */
const initFullscreenSettings = (...additionalObservers) => {
    additionalObservers.forEach((observer) => {
        fullscreenObservers.add(observer);
    });
};

export default initFullscreenSettings;