import Observer from '../../observers/observer.js';
import {getActiveTabContentId, addTabbedUiObservers, removeTabbedUiObservers}
  from '../../observers/tabbed_ui.js';

/** <tab-content> custom element */
export default class TabContentElement extends HTMLElement {
  static tagName = 'tab-content';

  /** Construct a <tab-content> element. */
  constructor() {
    super();

    this.observer = new (class TabContentObserver extends Observer {
      /** @param { TabContentElement } tabContentElement */
      constructor(tabContentElement) {
        super();
        this.tabContentElement = tabContentElement;
      }

      /** @override */
      receive(_activeTabContentId) {
        this.tabContentElement.hidden = !this.tabContentElement.isActive();
      }
    })(this);
  }

  /**
   * Check if the current tab is active.
   * @return { boolean } `true` if this tab is active, `false` otherwise.
   */
  isActive() {
    return getActiveTabContentId() === this.id;
  }

  /** Callback when the element is loaded into DOM. */
  connectedCallback() {
    addTabbedUiObservers(this.observer);
    console.log('Added tab content observer');
  }

  /** Callback when the element is removed from DOM. */
  disconnectedCallback() {
    removeTabbedUiObservers(this.observer);
    console.log('Removed tab content observer');
  }
}

customElements.define(TabContentElement.tagName, TabContentElement);
