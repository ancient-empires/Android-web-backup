import Observer from "./observer.js";

/** @type { Set<Observer> } */
const mainElementObservers = new Set();

const mainElementProxy = new Proxy({
    "showMainElement": false
}, {
    set: /** @returns { boolean } */ (target, prop, value) => {
        return Reflect.has(target, prop)
            && Reflect.set(target, prop, Boolean(value))
            && (() => {
                switch (prop) {
                    default:
                        break;
                    case "showMainElement":
                        {
                            mainElementObservers.forEach((observer) => {
                                observer.receive(Boolean(value));
                            })
                        }
                        break;
                }
                return true;
            })();
    }
});

export const setMainUiVisibility = (value) => {
    mainElementProxy.showMainElement = Boolean(value);
}

/**
 * @param { boolean } visibility
 * @param { Observer[] } observers
 */
const initMainUi = (visibility, ...observers) => {
    observers.forEach((observer) => {
        mainElementObservers.add(observer);
    })

    setMainUiVisibility(visibility);
}

export default initMainUi;