export const BLANK_URL = 'about:blank';

/**
 * Check if an iframe is blank.
 * @param { HTMLIFrameElement } iframe the iframe to check.
 * @return { boolean } `true` if blank, `false` otherwise.
 */
export const iframeIsBlank = (iframe) => {
  return !iframe.src ||
    iframe.contentWindow.location.href === BLANK_URL;
};

/**
 * Set IFrame `src` attribute.
 *
 * @param { HTMLIFrameElement } iframe the iframe to set `src`.
 * @param { ?string } src the URL to set.
 *   Set it as `null` or `undefined` to remove the `src` attribute.
 *   Defaults to empty string ('').
 */
export const setIframeSrc = (iframe, src = '') => {
  if (src === null || src === undefined || src === '' ||
    src === BLANK_URL) {
    iframe.removeAttribute('src');
  } else {
    iframe.src = src;
  }
};
