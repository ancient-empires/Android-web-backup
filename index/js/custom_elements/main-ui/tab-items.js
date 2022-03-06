import {normalizeHash} from '../../helpers.js';

/** <tab-items> custom element */
export default class TabItemsElement extends HTMLElement {
  static tagName = 'tab-items';

  /**
   * Construct a `<tab-items>` element.
   *
   * Accepted attributes:
   * - `default-tab-hash` *(optional)*: hash of default tab.
   * Default value is empty string (`''`).
   *    - Tabs other than the default tab that are closeable
   * (`<tab-item>` elements whose `target-hash` attribute does not
   * match `default-tab-hash` and whose `closeable` attribute is
   * present) are automatically set to hidden in the initial state.
   */
  constructor() {
    super();
    this.defaultTabHash = normalizeHash(this.getAttribute('default-tab-hash'));
  }
}

customElements.define(TabItemsElement.tagName, TabItemsElement);
