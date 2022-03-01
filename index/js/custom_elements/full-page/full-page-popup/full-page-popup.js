import {createShadow} from '../../helper.js';

const template = /* html */ `
<slot><!-- Popup content --></slot>
`;

/** full-page custom element */
export default class FullPagePopupElement extends HTMLElement {
  /** Initialize a full-page-popup element. */
  constructor() {
    super();
    createShadow(this, 'closed', template);
  }
}

customElements.define('full-page-popup', FullPagePopupElement);
