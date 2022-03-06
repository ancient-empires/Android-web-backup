const domParser = new DOMParser();

/**
 * Parse HTML string.
 * @param { string } htmlStr
 * @return { Document }
*/
export const parseHtml = (htmlStr) =>
  domParser.parseFromString(htmlStr, 'text/html');

/**
 * Get internal styles.
 * @param { Document } doc
 * @return { NodeList }
*/
export const getInternalStyles = (doc) =>
  doc.querySelectorAll('style');

/**
 * Get external stylesheets.
 * @param { Document } doc
 * @return { NodeList }
*/
export const getExternalStylesheets = (doc) =>
  doc.querySelectorAll('link[rel="stylesheet"]');

/**
 * Get body.
 * @param { Document } doc
 * @return { HTMLElement }
*/
export const getBody = (doc) => doc.body;

/**
 * Create a shadow root.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#autonomous_custom_elements
 * @param { HTMLElement } hostElement
 * @param { 'open' | 'closed' } mode
 * @param { string } template
 * @return { ShadowRoot }
 */
export const createShadow = (hostElement, mode, template) => {
  const shadowRoot = hostElement.attachShadow({'mode': mode});

  const templateDoc = parseHtml(template);

  // Extract external stylesheets, internal styles, and body.
  const externalStylesheets = getExternalStylesheets(templateDoc);
  const internalStyles = getInternalStyles(templateDoc);
  const body = getBody(templateDoc);

  shadowRoot.append(...externalStylesheets, ...internalStyles,
      ...body.childNodes);

  return shadowRoot;
};
