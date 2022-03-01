import {createShadow} from '../helper.js';

const template = /* html */ `
<slot><!-- Elements within the container --></slot>
`;

/** full-page custom element */
export default class FullPageElement extends HTMLElement {
  /** Initialize a full-page element. */
  constructor() {
    super();
    createShadow(this, 'closed', template);
  }
}

customElements.define('full-page', FullPageElement);
