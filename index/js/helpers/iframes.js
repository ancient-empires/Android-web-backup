export const BLANK_URL = 'about:blank';

/**
 * Check if an iframe is blank.
 * @param { HTMLIFrameElement } iframe the iframe to check.
 * @return { boolean } `true` if blank, `false` otherwise.
 */
export const iframeIsBlank = (iframe) => {
  return iframe.contentWindow.location.href === BLANK_URL;
};
