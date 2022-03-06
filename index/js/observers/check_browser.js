import Observer from './observer.js';

/**
 * Check if the browser supports Web SQL,
 * and show the popup if not.
 */
export class WebSqlSupportObserver extends Observer {
  /** @param { HTMLDivElement } popup */
  constructor(popup) {
    super();
    this.popup = popup;
  }

  /** @override */
  receive(value) {
    this.popup.hidden = Boolean(value);
  }
}

/**
 * Check if the browser is running with mobile user agent,
 * and show the popup if not.
 */
export class IsMobileObserver extends Observer {
  /** @param { HTMLDivElement } popup */
  constructor(popup) {
    super();
    this.popup = popup;
  }

  /** @override */
  receive(value) {
    this.popup.hidden = Boolean(value);
  }
}

const observers = {
  /** @type { ?WebSqlSupportObserver } */
  'webSqlSupportObserver': null,
  /** @type { ?IsMobileObserver } */
  'isMobileObserver': null,
};

const browserSupportProxy = new Proxy(Object.seal({
  'hasWebSqlSupport': false,
  'isMobile': false,
}), {
  set: /** @return { boolean } */ (target, prop, value) => {
    return Reflect.set(target, prop, Boolean(value)) &&
      (() => {
        switch (prop) {
          default:
            break;
          case 'hasWebSqlSupport':
            observers.webSqlSupportObserver?.receive(Boolean(value));
            break;
          case 'isMobile':
            observers.isMobileObserver?.receive(Boolean(value));
            break;
        }
        return true;
      })();
  },
});

/** @return { boolean } */
const hasWebSqlSupport = () => Boolean(window.openDatabase);

/** @return { boolean } */
const checkWebSqlSupport = () =>
  browserSupportProxy.hasWebSqlSupport = hasWebSqlSupport();

/** @return { boolean } */
const isMobile = () => {
  const ANDROID_USER_AGENT = /Android/;
  const IOS_USER_AGENT = /CriOS/;

  const userAgent = window.navigator.userAgent;

  return Boolean(userAgent.match(ANDROID_USER_AGENT) ||
      userAgent.match(IOS_USER_AGENT));
};

/** @return { boolean } */
const checkMobileUserAgent = () =>
  browserSupportProxy.isMobile = isMobile();

/** @return { boolean } */
const checkBrowserSupport = () =>
  checkWebSqlSupport() && checkMobileUserAgent();

/**
 * Initialize the Web SQL observer and mobile user agent observer.
 * Check browser support.
 *
 * @param { WebSqlSupportObserver } [webSqlSupportObserver]
 * @param { IsMobileObserver } [isMobileObserver]
 * @return { boolean } `true` if the browser supports
 * running the game, `false` otherwise.
 */
const initCheckBrowserSupport = (webSqlSupportObserver, isMobileObserver) => {
  observers.webSqlSupportObserver = webSqlSupportObserver;
  observers.isMobileObserver = isMobileObserver;

  return checkBrowserSupport();
};

export default initCheckBrowserSupport;
