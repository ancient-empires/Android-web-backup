/**
 * Get internal styles.
 * @param { Document } doc
 * @return { NodeList }
*/
const getInternalStyles = (doc) =>
  doc.querySelectorAll('style');

/**
 * Get external stylesheets.
 * @param { Document } doc
 * @return { NodeList }
*/
const getExternalStylesheets = (doc) =>
  doc.querySelectorAll('link[rel="stylesheet"]');

/**
 * Create a shadow root.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#autonomous_custom_elements
 * @param { HTMLElement } element
 * @param { 'open' | 'closed' } mode
 * @param { string } template
 * @return { ShadowRoot }
 */
export const createShadow = (element, mode, template) => {
  const shadowRoot = element.attachShadow({'mode': mode});

  const domParser = new DOMParser();
  const templateDoc = domParser.parseFromString(template, 'text/html');

  // Extract external stylesheets, internal styles, and body.
  const externalStylesheets = getExternalStylesheets(templateDoc);
  const internalStyles = getInternalStyles(templateDoc);
  const body = templateDoc.body;

  shadowRoot.append(...externalStylesheets);
  shadowRoot.append(...internalStyles);
  shadowRoot.append(...body.childNodes);

  return shadowRoot;
};
