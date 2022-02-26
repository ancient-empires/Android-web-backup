import { NO_SHOW } from "./common_classes.js";

const WEB_SQL_UNSUPPORTED_COVER_ID = "web-sql-unsupported";
const NOT_MOBILE_USER_AGENT_ID = "not-mobile-user-agent";

const browserSupportProxy = new Proxy({
    "hasWebSqlSupport": false,
    "isMobile": false
}, {
    set: (target, prop, value) => {
        switch (prop) {
            default:
                return false;
            case "hasWebSqlSupport":
                if (!value) {
                    const cover = document.getElementById(WEB_SQL_UNSUPPORTED_COVER_ID);
                    cover.setAttribute("open", true);
                }
                return true;
            case "isMobile":
                if (!value) {
                    const cover = document.getElementById(NOT_MOBILE_USER_AGENT_ID);
                    cover.setAttribute("open", true);
                }
                return true;
        }
    }
});

const hasWebSqlSupport = () => Boolean(window.openDatabase);

const checkWebSqlSupport = () => {
    return browserSupportProxy.hasWebSqlSupport = hasWebSqlSupport();
}

const isMobile = () => {
    const ANDROID_USER_AGENT = /Android/;
    const IOS_USER_AGENT = /CriOS/;

    const userAgent = window.navigator.userAgent;

    return Boolean(userAgent.match(ANDROID_USER_AGENT) || userAgent.match(IOS_USER_AGENT));
}

const checkMobileUserAgent = () => {
    return browserSupportProxy.isMobile = isMobile();
}

const checkBrowserSupport = () => {
    return checkWebSqlSupport() && checkMobileUserAgent();
}

export default checkBrowserSupport;