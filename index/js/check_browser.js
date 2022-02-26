import { WEB_SQL_UNSUPPORTED_DIALOG_ID, NOT_MOBILE_USER_AGENT_DIALOG_ID } from "./key_element_ids.js";

const browserSupportProxy = new Proxy({
    "hasWebSqlSupport": false,
    "isMobile": false
}, {
    set: (target, prop, value) => {
        return (() => {
            switch (prop) {
                default:
                    return false;
                case "hasWebSqlSupport":
                    {
                        const dialog = document.getElementById(WEB_SQL_UNSUPPORTED_DIALOG_ID);
                        if (!value) {
                            dialog.setAttribute("open", true);
                        } else {
                            dialog.removeAttribute("open");
                        }
                        return true;
                    }
                case "isMobile":
                    {
                        const dialog = document.getElementById(NOT_MOBILE_USER_AGENT_DIALOG_ID);
                        if (!value) {
                            dialog.setAttribute("open", true);
                        } else {
                            dialog.removeAttribute("open");
                        }
                        return true;
                    }
            }
        })() && (() => {
            target[prop] = value;
            return true;
        })();
    }
});

const hasWebSqlSupport = () => Boolean(window.openDatabase);

const checkWebSqlSupport = () => {
    browserSupportProxy.hasWebSqlSupport = hasWebSqlSupport();
    return browserSupportProxy.hasWebSqlSupport;
}

const isMobile = () => {
    const ANDROID_USER_AGENT = /Android/;
    const IOS_USER_AGENT = /CriOS/;

    const userAgent = window.navigator.userAgent;

    return Boolean(userAgent.match(ANDROID_USER_AGENT) || userAgent.match(IOS_USER_AGENT));
}

const checkMobileUserAgent = () => {
    browserSupportProxy.isMobile = isMobile();
    return browserSupportProxy.isMobile;
}

const checkBrowserSupport = () => {
    return checkWebSqlSupport() && checkMobileUserAgent();
}

export default checkBrowserSupport;