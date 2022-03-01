import {WEB_SQL_UNSUPPORTED_POPUP_ID,
  NOT_MOBILE_USER_AGENT_POPUP_ID} from './key_element_ids.js';
import Observer from './observer.js';

/**
 * Check if the browser supports Web SQL,
 * and show the popup if not.
 */
class WebSqlSupportObserver extends Observer {
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
class IsMobileObserver extends Observer {
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

/** @type { ?WebSqlSupportObserver } */
const webSqlSupportObserver = new WebSqlSupportObserver(
    document.getElementById(WEB_SQL_UNSUPPORTED_POPUP_ID));

/** @type { ?IsMobileObserver } */
const isMobileObserver = new IsMobileObserver(
    document.getElementById(NOT_MOBILE_USER_AGENT_POPUP_ID));

const browserSupportProxy = new Proxy(Object.seal({
  'hasWebSqlSupport': false,
  'isMobile': false,
}), {
  set: /** @returns { boolean } */ (target, prop, value) => {
    return Reflect.set(target, prop, Boolean(value)) &&
      (() => {
        switch (prop) {
          default:
            break;
          case 'hasWebSqlSupport':
            webSqlSupportObserver.receive(Boolean(value));
            break;
          case 'isMobile':
            isMobileObserver.receive(Boolean(value));
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

export default checkBrowserSupport;
