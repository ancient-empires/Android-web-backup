import { WEB_SQL_UNSUPPORTED_POPUP_ID, NOT_MOBILE_USER_AGENT_POPUP_ID } from "./key_element_ids.js";

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
                        {
                            const popup = document.getElementById(WEB_SQL_UNSUPPORTED_POPUP_ID);
                            popup.hidden = Boolean(value);
                        }
                        break;
                    case "isMobile":
                        {
                            const popup = document.getElementById(NOT_MOBILE_USER_AGENT_POPUP_ID);
                            popup.hidden = Boolean(value);
                        }
                        break;
                }
                return true;
            })();
    }
});

/** @returns { boolean } */
const hasWebSqlSupport = () => Boolean(window.openDatabase);

/** @returns { boolean } */
const checkWebSqlSupport = () => {
    browserSupportProxy.hasWebSqlSupport = hasWebSqlSupport();
    return browserSupportProxy.hasWebSqlSupport;
}

/** @returns { boolean } */
const isMobile = () => {
    const ANDROID_USER_AGENT = /Android/;
    const IOS_USER_AGENT = /CriOS/;

    const userAgent = window.navigator.userAgent;

    return Boolean(userAgent.match(ANDROID_USER_AGENT) || userAgent.match(IOS_USER_AGENT));
}

/** @returns { boolean } */
const checkMobileUserAgent = () => {
    browserSupportProxy.isMobile = isMobile();
    return browserSupportProxy.isMobile;
}

/** @returns { boolean } */
const checkBrowserSupport = () => {
    return checkWebSqlSupport() && checkMobileUserAgent();
}

export default checkBrowserSupport;