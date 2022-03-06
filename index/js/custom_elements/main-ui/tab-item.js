import {parseHtml, createShadow} from '../dom_helpers.js';
import {normalizeHash, navigateToHash} from '../../helpers.js';

const LABEL_CLASS_NAME = 'js-label';
const RADIO_CLASS_NAME = 'js-radio';
const SHADOW_HOST_CLASS_NAME = 'js-shadow-host';

const TAB_ACCESSOR_ID = 'tab-accessor';

/**
 * <tab-item> custom element
 * (used on tab switcher; lets the user click to switch tabs) */
export default class TabItemElement extends HTMLElement {
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
   * Construct a tab item element.
   *
   * Accepted attributes:
   * - `name`: the name of the tab.
   * - `radio-name`: the name of the mutually exclusive
   * list of tabs (only one tab can be selected at a time).
   * - `target-hash` *(optional)*: the target tab to jump to
   * when the this tab item is clicked.
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
    this.targetHash = normalizeHash(this.getAttribute('target-hash'));
    this.iconSrc = this.getAttribute('icon-src');
    this.iconAlt = this.getAttribute('icon-alt') || this.name;
    this.closeable = this.hasAttribute('closeable');
    this.gameFrameId = this.getAttribute('game-iframe-id');

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

    const shadowDomStr = /* html */ `
      <style>${TabItemElement.shadowStyle}</style>
      <div class="tab-item-container">
        <button class="tab-accessor" id="${TAB_ACCESSOR_ID}">
          <img class="tab-icon" src="${this.iconSrc}" alt="${this.iconAlt}" />
          <span class="tab-name">${this.name}</span>
        </button>
        ${this.closeable ?
          /* html */ `<button role="button"
            class="close-button">&#x2715</button>` :
          ''}
      </div>`;

    const dom = parseHtml(labelStr);

    // select radio button if window hash matches
    // the hash of the target tab
    const radio = dom.querySelector(`.${RADIO_CLASS_NAME}`);
    radio.addEventListener('input', this.selectTab.bind(this));
    this.setRadioStatus = () => {
      radio.checked = this.isActiveTab();
    };
    this.setRadioStatus();

    const shadowRoot = createShadow(
        dom.querySelector(`.${SHADOW_HOST_CLASS_NAME}`),
        'closed', shadowDomStr);

    // navigate to the corresponding hash when the current tab
    // is activated
    const tabAccessor = shadowRoot.getElementById(TAB_ACCESSOR_ID);
    tabAccessor.addEventListener('click', this.selectTab.bind(this));

    this.append(...dom.body.children);
  }

  /** Callback when the element is loaded into the document DOM. */
  connectedCallback() {
    window.addEventListener('hashchange', this.setRadioStatus);
  }

  /** Callback when the element is removed from the document DOM. */
  disconnectedCallback() {
    window.removeEventListener('hashchange', this.setRadioStatus);
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
    navigateToHash(this.targetHash, true);
  }
}

customElements.define('tab-item', TabItemElement);
