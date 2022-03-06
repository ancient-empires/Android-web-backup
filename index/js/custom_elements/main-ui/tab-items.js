import {normalizeHash} from '../../helpers.js';

/** <tab-items> custom element */
export default class TabItemsElement extends HTMLElement {
  static tagName = 'tab-items';

  /**
   * Construct a <tab-items> element.
   *
   * Accepted attributes:
   * - `default-tab-hash` *(optional)*: hash of default tab.
   * Default value is empty string (`''`).
   */
  constructor() {
    super();
    this.defaultTabHash = normalizeHash(this.getAttribute('default-tab-hash'));
  }
}

customElements.define(TabItemsElement.tagName, TabItemsElement);
