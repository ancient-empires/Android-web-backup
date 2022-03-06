import {parseHtml, createShadow} from '../dom_helpers.js';
import {normalizeHash, navigateToHash} from '../../helpers.js';

import TabItemsElement from './tab-items.js';

const LABEL_CLASS_NAME = 'js-label';
const RADIO_CLASS_NAME = 'js-radio';
const SHADOW_HOST_CLASS_NAME = 'js-shadow-host';

const TAB_ACCESSOR_ID = 'tab-accessor';
const CLOSE_BUTTON_ID = 'close-button';

/**
 * <tab-item> custom element used on tab switcher,
 * which lets the user click to switch tabs.
 * Must be placed inside a <tab-items> element.
 * @see {@link tab-items.js}
 */
export default class TabItemElement extends HTMLElement {
  static tagName = 'tab-item';

  static shadowStyle = /* css */ `
    @import url('/index/css/colors.css');

    * {
      box-sizing: border-box;
    }

    button {
      background-color: transparent;
      border: none;

      color: inherit;
      font-family: inherit;
      font-size: inherit;
    }

    .tab-item-container {
      display: flex;
    }

    .tab-accessor {
      flex-grow: 1;

      padding: 0.25em 0.5em;

      display: flex;
      align-items: center;
      gap: 0.5em;

      text-align: start;
    }

    .tab-icon {
      --size: 24px;

      width: var(--size);
      height: var(--size);
    }

    .tab-name {
      flex-grow: 1;
    }

    .close-button {
      margin: 0;
      padding: 0 0.5em;
    }`;

  /**
   * Construct a `<tab-item>` element.
   *
   * Accepted attributes:
   * - `name`: the name of the tab.
   * - `radio-name`: the name of the mutually exclusive
   * list of tabs (only one tab can be selected at a time).
   * - `target-hash` *(optional)*: the target tab to jump to
   * when the this tab item is clicked.
   *    - If not present, jump to the top of the document.
   *    - The hash symbol `#` shall *NOT* be provided in user input.
   * - `icon-src`: URL of the tab icon.
   * - `icon-alt` *(optional)*: Alternative description text of the tab icon.
   *    - If not provided, then defaults to the tab name (`name` attribute).
   * - `closeable` *(optional, boolean)*: whether this tab can be closed.
   * Defaults to `false`.
   *    - The tab whose `target-hash` matches the `default-tab-hash` attribute
   *      of the parent `default-tab-hash` attribute must *NOT* be closeable.
   *
   * - `game-iframe-id` *(optional)*: the ID of the `<iframe>`
   * element that hosts the actual game.
  */
  constructor() {
    super();

    if (!(this.parentElement instanceof TabItemsElement)) {
      throw new TypeError(`A <${TabItemElement.tagName}> element \
must be placed inside a <${TabItemsElement.tagName}> element.`);
    }

    this.name = this.getAttribute('name');
    this.radioName = this.getAttribute('radio-name');
    this.targetHash = normalizeHash(this.getAttribute('target-hash'));
    this.iconSrc = this.getAttribute('icon-src');
    this.iconAlt = this.getAttribute('icon-alt') || this.name;
    this.closeable = this.hasAttribute('closeable');
    this.gameFrameId = this.getAttribute('game-iframe-id');

    if (this.isDefaultTab() && this.closeable) {
      throw new Error(`The "${this.name}" tab is the default tab \
with target hash "${this.targetHash}", and it must not be closeable`);
    }
    this.hidden = !this.isDefaultTab() && this.closeable;

    // <label> element for selecting the radio button
    // and for containing clickable controls of the tab
    const labelStr = /* html */ `
      <label class="${LABEL_CLASS_NAME}">
        <!-- Radio button to select active tab -->
        <input type="radio" value="${this.targetHash}"
          class="${RADIO_CLASS_NAME}" name=${this.radioName}
          hidden />
        <!-- Clickable controls -->
        <div class="container ${SHADOW_HOST_CLASS_NAME}">
          <!-- Attach shadow DOM here -->
        </div>
      </label>`;

    // Shadow DOM for clickable controls
    const shadowDomStr = /* html */ `
      <style>${TabItemElement.shadowStyle}</style>
      <div class="tab-item-container">
        <button class="tab-accessor" id="${TAB_ACCESSOR_ID}">
          <img class="tab-icon" src="${this.iconSrc}" alt="${this.iconAlt}" />
          <span class="tab-name">${this.name}</span>
        </button>
        ${this.closeable ?
          /* html */ `<button role="button" id="${CLOSE_BUTTON_ID}"
            class="close-button">&#x1f5d9</button>` :
          ''}
      </div>`;

    const dom = parseHtml(labelStr);

    // select radio button if window hash matches
    // the hash of the target tab
    const radio = dom.querySelector(`.${RADIO_CLASS_NAME}`);
    radio.checked = this.isActiveTab();
    radio.addEventListener('input', this.selectTab.bind(this));

    // helper function to handle hash changes
    this.hashChangeListener = () => {
      if (this.isActiveTab()) {
        this.hidden = false;
      }
      radio.checked = this.isActiveTab();
    };

    const shadowRoot = createShadow(
        dom.querySelector(`.${SHADOW_HOST_CLASS_NAME}`),
        'closed', shadowDomStr);

    // set tab accessor click event: navigate to the corresponding
    // target hash when the current tab is activated
    const tabAccessor = shadowRoot.getElementById(TAB_ACCESSOR_ID);
    tabAccessor.addEventListener('click', this.selectTab.bind(this));

    // set click event for close button
    if (this.closeable) {
      const closeButton = shadowRoot.getElementById(CLOSE_BUTTON_ID);
      closeButton.addEventListener('click', this.closeTab.bind(this));
    }

    this.append(...dom.body.children);
  }

  /** Callback when the element is loaded into the document DOM. */
  connectedCallback() {
    window.addEventListener('hashchange', this.hashChangeListener);
  }

  /** Callback when the element is removed from the document DOM. */
  disconnectedCallback() {
    window.removeEventListener('hashchange', this.hashChangeListener);
  }

  /**
   * Check if the current tab is default tab,
   * i.e. "target-hash" attribute matches
   * "default-tab-hash" attribute of parent element.
   * @see {@link tab-items.js}
   *
   * @return { boolean } `true` if this tab is default tab, `false` otherwise.
   */
  isDefaultTab() {
    /** @type { TabItemsElement } */
    const tabItemsElement = this.parentElement;
    return this.targetHash === tabItemsElement.defaultTabHash;
  }

  /**
   * Check if the current tab is active.
   * @return { boolean } `true` if this tab is active, `false` otherwise.
   */
  isActiveTab() {
    return window.location.hash === this.targetHash;
  }

  /** Select current tab. */
  selectTab() {
    this.hidden = false;
    navigateToHash(this.targetHash, true);
  }

  /** Close current tab. */
  closeTab() {
    if (this.closeable) {
      this.hidden = true;

      /** @type { TabItemsElement } */
      const tabItems = this.parentElement;
      navigateToHash(tabItems.defaultTabHash, true);
    }
  }
}

customElements.define(TabItemElement.tagName, TabItemElement);
