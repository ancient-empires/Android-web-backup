import Observer from '../../observers/observer.js';
import {startGame, endGame, addGameStatusObservers, removeGameStatusObservers}
  from '../../observers/game_runner.js';
import {getActiveTabContentId, setActiveTabContentId,
  addTabbedUiObservers, removeTabbedUiObservers}
  from '../../observers/tabbed_ui.js';

import {parseHtml, createShadow} from '../dom_helpers.js';
import TabItemsElement from './tab-items.js';

const LABEL_CLASS_NAME = 'js-label';
const RADIO_CLASS_NAME = 'js-radio';
const SHADOW_HOST_CLASS_NAME = 'js-shadow-host';

const TAB_ACCESSOR_ID = 'tab-accessor';
const FULLSCREEN_BUTTON_ID = 'fullscreen-button';
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
      line-height: 1;
    }

    button {
      padding: 0.25em 0.5em;

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
    }`;

  /**
   * Construct a `<tab-item>` element.
   *
   * Accepted attributes:
   * - `name`: the name of the tab.
   * - `radio-name`: the name of the mutually exclusive
   * list of tabs (only one tab can be selected at a time).
   * - `target-tab-content-id`: the <tab-content> element to display
   * when the user selects this tab. @see {@link tab-content.js}
   * - `icon-src`: URL of the tab icon.
   * - `icon-alt` *(optional)*: Alternative description text of
   *    the tab icon.
   *    - If not provided, then defaults to the tab name (`name`
   *      attribute).
   * - `closeable` *(optional, boolean)*: whether this tab can be
   *   closed. (Defaults to `false`)
   *    - The tab whose `target-tab-content-id` matches the
   *      `default-tab-content-id` attribute of the parent
   *      `<tab-contents>` element must *NOT* be closeable.
   * - `game` *(optional)*: the string representing the actual
   *   game. *(Must be in **lowercase**)*
   *    - Currently accepted values are: `ae1`, `ae2`.
  */
  constructor() {
    super();

    if (!(this.parentElement instanceof TabItemsElement)) {
      throw new TypeError(`A <${TabItemElement.tagName}> element \
must be placed inside a <${TabItemsElement.tagName}> element.`);
    }

    this.name = this.getAttribute('name');
    this.radioName = this.getAttribute('radio-name');
    this.targetTabContentId = this.getAttribute('target-tab-content-id');
    this.iconSrc = this.getAttribute('icon-src');
    this.iconAlt = this.getAttribute('icon-alt') || this.name;
    this.closeable = this.hasAttribute('closeable');
    this.game = this.getAttribute('game');

    if (this.isDefaultTab() && this.closeable) {
      throw new Error(`The "${this.name}" tab is the default tab \
with target <tab-content> element ID "${this.targetTabContentId}", \
and it must not be closeable`);
    }
    this.hidden = !this.isDefaultTab() && this.closeable;

    // <label> element for selecting the radio button
    // and for containing clickable controls of the tab
    const labelStr = /* html */ `
      <label class="${LABEL_CLASS_NAME}">
        <!-- Radio button to select active tab -->
        <input type="radio" value="${this.targetTabContentId}"
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
        <button class="tab-accessor" id="${TAB_ACCESSOR_ID}"
          title="${this.name}">
          <img class="tab-icon" src="${this.iconSrc}" alt="${this.iconAlt}" />
          <span class="tab-name">${this.name}</span>
        </button>
        ${this.game ?
          /* html */ `<button role="button" id="${FULLSCREEN_BUTTON_ID}"
            title='Run the game in fullscreen'>&#x2922</button>` :
          ''}
        ${this.closeable ?
          /* html */ `<button role="button" id="${CLOSE_BUTTON_ID}"
            title='Close the game'>&#x1f5d9</button>` :
          ''}
      </div>`;

    const dom = parseHtml(labelStr);

    // select current tab if the game is started
    this.gameStatusObserver = new (class gameStatusObserver extends Observer {
      /** @param { TabItemElement } tabItemElement */
      constructor(tabItemElement) {
        super();
        this.tabItemElement = tabItemElement;
      }

      /**
       * Select the current tab if the current game is running.
       * @override
       * @param { boolean } gameIsRunning
       */
      receive(gameIsRunning) {
        if (gameIsRunning) {
          if (!this.tabItemElement.isActiveTab()) {
            this.tabItemElement.selectTab();
          }
        } else {
          if (this.tabItemElement.isOpen()) {
            this.tabItemElement.closeTab();
          }
        }
      }
    })(this);

    // select radio button if the current tab is active
    /** @type { HTMLInputElement } */
    const radio = dom.querySelector(`.${RADIO_CLASS_NAME}`);
    radio.checked = this.isActiveTab();
    radio.addEventListener('input', this.selectTab.bind(this));
    this.radioObserver = new (class RadioObserver extends Observer {
      /** @param { TabItemElement } tabItemElement */
      constructor(tabItemElement) {
        super();
        this.tabItemElement = tabItemElement;
      }

      /**
       * Activate the radio button corresponding to the active tab.
       * @override
       * @param { string } _activeTabContentId not used.
      */
      receive(_activeTabContentId) {
        radio.checked = this.tabItemElement.isActiveTab();
      }
    })(this);

    const shadowRoot = createShadow(
        dom.querySelector(`.${SHADOW_HOST_CLASS_NAME}`),
        'closed', shadowDomStr);

    // set tab accessor click event: select the current tab
    const tabAccessor = shadowRoot.getElementById(TAB_ACCESSOR_ID);
    tabAccessor.addEventListener('click', this.selectTab.bind(this));

    // set click event for fullscreen button
    if (this.game) {
      const fullscreenButton = shadowRoot.getElementById(FULLSCREEN_BUTTON_ID);
      fullscreenButton.addEventListener('click', () => {
        this.selectTab();
      });
    }

    // set click event for close button
    if (this.closeable) {
      const closeButton = shadowRoot.getElementById(CLOSE_BUTTON_ID);
      closeButton.addEventListener('click', this.closeTab.bind(this));
    }

    this.append(...dom.body.children);
  }

  /** Callback when the element is loaded into DOM. */
  connectedCallback() {
    if (this.game) {
      addGameStatusObservers(this.game, this.gameStatusObserver);
    }
    addTabbedUiObservers(this.radioObserver);
  }

  /** Callback when the element is removed from DOM. */
  disconnectedCallback() {
    if (this.game) {
      removeGameStatusObservers(this.game, this.gameStatusObserver);
    }
    removeTabbedUiObservers(this.radioObserver);
  }

  /**
   * Check if the current tab is default tab,
   * i.e. the `target-tab-content-id` attribute matches the
   * `default-tab-content-id` attribute of parent element.
   * @see {@link tab-items.js}
   *
   * @return { boolean } `true` if this tab is default tab, `false` otherwise.
   */
  isDefaultTab() {
    /** @type { TabItemsElement } */
    const parentTabItemsElement = this.parentElement;
    return this.targetTabContentId ===
      parentTabItemsElement.defaultTabContentId;
  }

  /**
   * Check if the current tab is open.
   * @return { boolean } `true` if this tab is open, `false` otherwise.
   */
  isOpen() {
    return !this.closeable || !this.hidden;
  }

  /**
   * Check if the current tab is active.
   * @return { boolean } `true` if this tab is active, `false` otherwise.
   */
  isActiveTab() {
    return getActiveTabContentId() === this.targetTabContentId;
  }

  /** Open current tab. */
  openTab() {
    if (this.isOpen()) {
      return;
    }

    this.hidden = false;

    // start the game when opening the tab
    if (this.game) {
      startGame(this.game);
    }
  }

  /** Select current tab. */
  selectTab() {
    this.openTab();
    setActiveTabContentId(this.targetTabContentId);
  }

  /** Close current tab. */
  closeTab() {
    if (!this.isOpen()) {
      return;
    }

    if (this.closeable) {
      this.hidden = true;

      /** @type { TabItemsElement } */
      const tabItems = this.parentElement;
      setActiveTabContentId(tabItems.defaultTabContentId);
    }

    // end the game if it is running
    if (this.game) {
      endGame(this.game);
    }
  }
}

customElements.define(TabItemElement.tagName, TabItemElement);
