/** @return { boolean } */
export const hasWebSqlSupport = () => Boolean(window.openDatabase);

/** @return { boolean } */
export const isMobile = () => {
  const ANDROID_USER_AGENT = /Android/;
  const IOS_USER_AGENT = /CriOS/;

  const userAgent = window.navigator.userAgent;

  return Boolean(userAgent.match(ANDROID_USER_AGENT) ||
      userAgent.match(IOS_USER_AGENT));
};

/** @return { boolean } */
const browserIsSupported = () => hasWebSqlSupport() && isMobile();

export default browserIsSupported;
