import {setActiveTabContentId} from '../../observers/tabbed_ui.js';

/** <tab-items> custom element */
export default class TabItemsElement extends HTMLElement {
  static tagName = 'tab-items';

  /**
   * Construct a `<tab-items>` element.
   *
   * Accepted attributes:
   * - `default-tab-content-id`: ID of the `<tab-content>` element
   *   that acts as the default tab. @see {@link tab-content.js}
   */
  constructor() {
    super();
    this.defaultTabContentId = this.getAttribute('default-tab-content-id');

    setActiveTabContentId(this.defaultTabContentId);
  }
}

customElements.define(TabItemsElement.tagName, TabItemsElement);
