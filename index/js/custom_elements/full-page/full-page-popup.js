/** <full-page-popup> custom element */
export default class FullPagePopupElement extends HTMLElement {
  /** Initialize a full-page-popup element. */
  constructor() {
    super();
    createShadow(this, 'closed', template);
  }
}

customElements.define('full-page-popup', FullPagePopupElement);
