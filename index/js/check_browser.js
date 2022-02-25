import { NO_SHOW } from "./common_classes.js";

const WEB_SQL_UNSUPPORTED_COVER_ID = "web-sql-unsupported";
const NOT_MOBILE_USER_AGENT_ID = "not-mobile-user-agent";

const hasWebSqlSupport = () => Boolean(window.openDatabase);

const checkWebSqlSupport = () => {
    if (!hasWebSqlSupport()) {
        const cover = document.getElementById(WEB_SQL_UNSUPPORTED_COVER_ID);
        cover.setAttribute("open", true);

        return false;
    }
    return true;
}

const isMobile = () => {
    const ANDROID_USER_AGENT = /Android/;
    const IOS_USER_AGENT = /CriOS/;

    const userAgent = window.navigator.userAgent;

    return Boolean(userAgent.match(ANDROID_USER_AGENT) || userAgent.match(IOS_USER_AGENT));
}

const checkMobileUserAgent = () => {
    if (!isMobile()) {
        const cover = document.getElementById(NOT_MOBILE_USER_AGENT_ID);
        cover.setAttribute("open", true);

        return false;
    }
    return true;
}

const checkBrowserSupport = () => {
    return checkWebSqlSupport() && checkMobileUserAgent();
}

export default checkBrowserSupport;