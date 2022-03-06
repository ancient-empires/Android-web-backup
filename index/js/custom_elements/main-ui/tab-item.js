import {parseHtml, createShadow} from '../helper.js';

const LABEL_CLASS_NAME = 'js-label';
const RADIO_CLASS_NAME = 'js-radio';
const SHADOW_HOST_CLASS_NAME = 'js-shadow-host';

const TAB_ITEM_LINK_ID = 'link';

/**
 * <tab-item> custom element
 * (used on tab switcher; lets the user click to switch tabs) */
export default class TabItemElement extends HTMLElement {
  static shadowStyle = /* css */ `
    @import url('/index/css/colors.css');

    * {
      box-sizing: border-box;
    }

    .tab-item-container {
      display: flex;
    }

    .tab-link {
      flex-grow: 1;

      padding: 0.25em 0.5em;

      display: flex;
      align-items: center;
      gap: 0.5em;

      color: inherit;
      text-decoration: none;
    }

    .tab-icon {
      --size: 24px;

      width: var(--size);
      height: var(--size);
    }

    .tab-name {
      flex-grow: 1;
    }

    .tab-button {
      margin: 0;
      padding: 0 0.5em;
      width: auto;
      height: auto;

      border: none;
      background-color: transparent;
      color: inherit;
    }`;

  /**
   * Construct a tab item element.
   *
   * Accepted attributes:
   * - `name`: the name of the tab.
   * - `radio-name`: the name of the mutually exclusive
   * list of tabs (only one tab can be selected at a time).
   * - `hash` *(optional)*: the fragment to jump to
   * when the this tab item is activated.
   * If not present, jump to the top of the document.
   * The hash symbol `#` shall *NOT* be provided in user input.
   * - `icon-src`: URL of the tab icon.
   * - `icon-alt` *(optional)*: Alternative description text of the tab icon.
   * If not provided, then defaults to the tab name
   * (`name` attribute).
   * - `closeable` *(optional, boolean)*: whether this tab can be closed.
   * Defaults to `false`.
   * - `game-iframe-id` *(optional)*: the ID of the `<iframe>`
   * element that hosts the actual game.
  */
  constructor() {
    super();

    this.name = this.getAttribute('name');
    this.radioName = this.getAttribute('radio-name');
    this.hash = this.getAttribute('hash') || '';
    this.iconSrc = this.getAttribute('icon-src');
    this.iconAlt = this.getAttribute('icon-alt') || this.name;
    this.closeable = this.hasAttribute('closeable');
    this.gameFrameId = this.getAttribute('game-iframe-id');

    const labelStr = /* html */ `
      <label class="${LABEL_CLASS_NAME}">
        <!-- Radio button to select active tab -->
        <input type="radio" class="${RADIO_CLASS_NAME}"
          name=${this.radioName} hidden />
        <!-- Clickable controls -->
        <div class="container ${SHADOW_HOST_CLASS_NAME}">
          <!-- Attach shadow DOM here -->
        </div>
      </label>`;

    const shadowDomStr = /* html */ `
      <style>${TabItemElement.shadowStyle}</style>
      <div class="tab-item-container">
        <a class="tab-link" id="${TAB_ITEM_LINK_ID}" href="#${this.hash}">
          <img class="tab-icon" src="${this.iconSrc}" alt="${this.iconAlt}" />
          <span class="tab-name">${this.name}</span>
        </a>
        ${this.closeable ?
          /* html */ `<button role="button"
            class="tab-button">&#x2715</button>` :
          ''}
      </div>`;

    const dom = parseHtml(labelStr);
    const label = dom.querySelector(`.${LABEL_CLASS_NAME}`);

    const shadowRoot = createShadow(
        dom.querySelector(`.${SHADOW_HOST_CLASS_NAME}`),
        'closed', shadowDomStr);

    const tabItemLink = shadowRoot.getElementById(TAB_ITEM_LINK_ID);
    tabItemLink.addEventListener('click', () => {
      label.click();

      // ensure that the link color in shadow DOM is inherited properly
      tabItemLink.style = tabItemLink.style;
    });

    this.append(...dom.body.children);
  }

  /** Callback when the element is loaded into the document DOM. */
  connectedCallback() {
    /** @type { HTMLInputElement} */
    const radio = this.querySelector(`.${RADIO_CLASS_NAME}`);
    radio.checked = this.isDefaultTab();
  }

  /** @return { boolean } */
  isDefaultTab() {
    return !Boolean(this.hash);
  }
}

customElements.define('tab-item', TabItemElement);
