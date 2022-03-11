import {addToSet, removeFromSet} from '../helpers.js';

/** @typedef { import('./observer.js').default } Observer */

/** @type { Set<Observer> } */
const tabbedUiObservers = new Set();

const tabbedUiProxy = new Proxy(Object.seal({
  'activeTabContentId': '',
}), {
  set: /** @return { boolean } */
    (target, prop, value) => {
      const oldValue = Reflect.get(target, prop);
      value = String(value);

      return Reflect.set(target, prop, value) && (() => {
        switch (prop) {
          default:
            break;
          case 'activeTabContentId':
            if (oldValue !== value) {
              tabbedUiObservers.forEach((observer) => {
                observer.receive(value);
              });
            }
            break;
        }
        return true;
      })();
    },
});

/** @return { string } */
export const getActiveTabContentId = () => {
  return tabbedUiProxy.activeTabContentId;
};

/** @param { string } activeTabContentId */
export const setActiveTabContentId = (activeTabContentId) => {
  tabbedUiProxy.activeTabContentId = activeTabContentId;
};

/** @param { ...Observer } observers */
export const addTabbedUiObservers = (...observers) => {
  addToSet(tabbedUiObservers, ...observers);
};

/** @param { ...Observer } observers */
export const removeTabbedUiObservers = (...observers) => {
  removeFromSet(tabbedUiObservers, ...observers);
};
