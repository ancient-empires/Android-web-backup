import { WEB_SQL_UNSUPPORTED_POPUP_ID, NOT_MOBILE_USER_AGENT_POPUP_ID } from "./key_element_ids.js";
import Observer from "./observer.js";

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

const webSqlSupportObserver = new WebSqlSupportObserver(document.getElementById(WEB_SQL_UNSUPPORTED_POPUP_ID));
const isMobileObserver = new IsMobileObserver(document.getElementById(NOT_MOBILE_USER_AGENT_POPUP_ID));

const browserSupportProxy = new Proxy({
  "hasWebSqlSupport": false,
  "isMobile": false
}, {
  set: /** @returns { boolean } */ (target, prop, value) => {
    return Reflect.has(target, prop)
      && Reflect.set(target, prop, Boolean(value))
      && (() => {
        switch (prop) {
          default:
            break;
          case "hasWebSqlSupport":
            webSqlSupportObserver.receive(Boolean(value));
            break;
          case "isMobile":
            isMobileObserver.receive(Boolean(value));
            break;
        }
        return true;
      })();
  }
});

/** @returns { boolean } */
const hasWebSqlSupport = () => Boolean(window.openDatabase);

/** @returns { boolean } */
const checkWebSqlSupport = () => browserSupportProxy.hasWebSqlSupport = hasWebSqlSupport();

/** @returns { boolean } */
const isMobile = () => {
  const ANDROID_USER_AGENT = /Android/;
  const IOS_USER_AGENT = /CriOS/;

  const userAgent = window.navigator.userAgent;

  return Boolean(userAgent.match(ANDROID_USER_AGENT) || userAgent.match(IOS_USER_AGENT));
}

/** @returns { boolean } */
const checkMobileUserAgent = () => browserSupportProxy.isMobile = isMobile();

/** @returns { boolean } */
const checkBrowserSupport = () => checkWebSqlSupport() && checkMobileUserAgent();

export default checkBrowserSupport;