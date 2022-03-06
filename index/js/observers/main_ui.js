/** @typedef { import("./observer.js").default } Observer */

/** @type { Set<Observer> } */
const mainElementObservers = new Set();

const mainElementProxy = new Proxy(Object.seal({
  'show': false,
}), {
  set: /** @return { boolean } */ (target, prop, value) => {
    return Reflect.set(target, prop, Boolean(value)) &&
      (() => {
        switch (prop) {
          default:
            break;
          case 'show':
            {
              mainElementObservers.forEach((observer) => {
                observer.receive(Boolean(value));
              });
            }
            break;
        }
        return true;
      })();
  },
});

export const setMainUiVisibility = (value) => {
  mainElementProxy.show = Boolean(value);
};

/**
 * @param { boolean } visibility
 * @param { Observer[] } observers
 */
const initMainUi = (visibility, ...observers) => {
  observers.forEach((observer) => {
    mainElementObservers.add(observer);
  });

  setMainUiVisibility(visibility);
};

export default initMainUi;