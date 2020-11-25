/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win, doc) {

	"use strict";
	/*global window, document, location, Image */
	/*global Backbone, $, APP, log */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	var proto;

	APP.BB.BaseView = Backbone.View.extend({

		events: {
			// base
			'click [data-route]': 'routeTo',
			'click .js-back': 'routeBack',
			'click .js-external-link': 'toExternalLink',
			'click .js-stop-event': 'stopEvent',

			// hide view
			'hide': 'hide',

			// no scroll
			'touchmove .js-no-scroll': 'stopEvent',
			'gesturestart .js-no-scroll': 'stopEvent',
			'gesturechange .js-no-scroll': 'stopEvent',
			'gestureend .js-no-scroll': 'stopEvent',

			// fix extra scroll for iOS
			'touchstart .js-scroll-area-container': 'touchStartAutoScroll',

			// external
			'click .js-list-backward[data-group-name]': 'changeSelect',
			'click .js-list-changed-item[data-group-name]': 'changeSelect',
			'click .js-list-forward[data-group-name]': 'changeSelect',

			// tabs
			'click .js-tab-button': 'tabAction',
			'click .js-tab-close': 'tabClose',

			'click .js-change-on-off-setting-wrapper': 'changeOnOffSetting',
			'click .js-change-select-setting': 'changeSelectSetting'

		},

		popupUrl: 'popup=true',

		selectors: {
			wrapper: '.js-wrapper'
		},

		// will be change after initStatic
		eventTypes: {
			down: ['mousedown', 'touchstart'],
			move: ['mousemove', 'touchmove'],
			up: ['mouseup', 'touchend'],
			dbl: ['dblclick', 'doubletap']
		},

		initStatic: function () {

			proto.$wrapper = $(this.selectors.wrapper);

			var info = win.APP.info,
				isTouch = info.get('isTouch', true),
				eventTypesIndex = Number(isTouch),
				types = this.eventTypes,
				os = info.get('os', true);

			_.each(types, function (typesArr, key) {
				types[key] = typesArr[eventTypesIndex];
			});

			// sounds
			proto.events[types['down'] + ' [data-sound]'] = 'playSound';

			proto.$wrapper.addClass(os);
			proto.$wrapper.addClass('isMobile_' + isTouch);

			$(doc.body).on('contextmenu', this.stopEvent);

		},

		constructor: function() {

			this.events = $.extend( {}, proto.events, this.events );

			this.selectors = $.extend( {}, proto.selectors, this.selectors );

			this.attr = {};

			this.setClassNames();

			return Backbone.View.prototype.constructor.apply(this, arguments);
		},

		setClassNames: function () {

			this.classNames = {};

			_.each(this.selectors, function (value, key) {
				this[key] = value.replace(/\./g, ' ').trim();
			}, this.classNames);

		},

		initialize: function() {

			this.delegateEvents(); // fix for case -> get html async

		},

		changeSelect: function (e) { // external

			var $this = $(e.currentTarget),
				direction = $this.hasClass('js-list-backward') ? -1 : 1,
				groupName = $this.attr('data-group-name'),
				$container = this.$el.find('.js-list-changed-item[data-full-list][data-group-name="' + groupName + '"]'),
				listData = JSON.parse(decodeURI($container.attr('data-full-list'))),
				listLength = listData.length,
				currentKey = $container.attr('data-key'),
				followIndex = 0,
				followData;

			// find current index
			listData.every(function (obj, i) {
				if ( obj.key.toString() === currentKey ) {
					followIndex = i + direction;
					return false;
				}
				return true;
			});

			// adjust follow index
			if ( followIndex < 0 ) {
				followIndex = listLength - 1;
			}

			if ( followIndex >= listLength ) {
				followIndex = 0;
			}

			followData = listData[followIndex];

			$container.attr('data-key', followData.key);
			$container.attr('data-value', followData.value);
			$container.html(followData.value);

			$container.trigger('change');

		},

		hide: function () {

			log('hide view');

			var view = this;

			view.undelegateEvents();

			if (view.unbindEventListeners) {
				view.unbindEventListeners();
			}

			view.$el.removeData().unbind().remove().empty();

			view.remove();
			view.unbind();

			Backbone.View.prototype.remove.call(view);

		},

		render: function () {

			var $oldContainer = this.$wrapper.find('> div');
			$oldContainer.trigger('hide');

			this.$wrapper.append(this.$el);
			this.util.setSizes();
			this.util.toTop();

		},

		navigate: function() { //url, options
			APP.bb.router.navigate.apply(APP.bb.router, arguments);
		},

		routeTo: function(e) {

			var $this = $(e.currentTarget),
				route = $this.attr('data-route');

			this.navigate(route, true);

		},

		routeByUrl: function(route, options) {
			this.navigate(route, options);
		},

		routeToPopup: function () {

			var view = this;

			view.routeByUrl(Backbone.history.fragment + '?' + view.popupUrl);

		},

		routeBack: function(e) {

			this.stopEvent(e);

			// do not extra back if view is hiding - popup workaround
			if ( this.get('isHiding') && !win.APP.bb.router.isForce) {
				return;
			}

			if (location.hash) {
				Backbone.history.history.back();
			}

		},

		backTo: function (url, data) {

			data = data || {};

			var view = this,
				router = win.APP.bb.router;
			router.isForce = data.isForce;

			(function backTo() {
				setTimeout(function () {
					if (Backbone.history.fragment === url) {
						router.isForce = false;
						return;
					}
					view.routeBack();
					backTo();
				}, 200);
			}());

		},

		popupIsOpen: function () {

			var view = this,
				popupUrl = view.popupUrl,
				url = win.location.href;

			return url.indexOf(popupUrl) !== -1;

		},

		showPopup: function(data) {

			var view = this,
				deferred = $.Deferred(),
				popup;

			view.hidePopup();

			setTimeout(function () {
				popup =	new APP.BB.PopupView(data);
				popup.set('deferred', deferred);
			}, 50);

			return deferred.promise();

		},

		showTicket: function (data) {

			var deferred = $.Deferred(),
				popup;

			setTimeout(function () {
				popup =	new APP.BB.TicketView(data);
				popup.set('deferred', deferred);
			}, 50);

			return deferred.promise();

		},

		hidePopup: function () {

			$('.js-popup-wrapper').trigger('hide');

		},

		hidePopups: function (data) {

			data = data || {};

			var view = this,
				deferred = $.Deferred();

			(function hidePopups () {
				setTimeout(function () {
					if (view.isPopupExist()) {
						view.routeBack();
						hidePopups();
					} else {
						deferred.resolve();
					}
				}, data.timePadding || 0); // def se time out for routing is 50
			}());

			return deferred.promise();

		},

		isPopupExist: function () {
			var view = this,
				url = win.location.href,
				popupPart = view.popupUrl;

			return url.indexOf(popupPart) !== -1;

		},

		stopEvent: function(e) {

			if (e && e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}

		},

		toExternalLink: function(e) {

			this.stopEvent(e);

			var $this = $(e.currentTarget),
				url = $this.attr('href');

			win.open(url);

		},
		loadUrl: function () {
			Backbone.history.loadUrl();
		},

		changeBy: function (key, delta) {
			return this.set(key, this.get(key) + delta);
		},

		set: function (key, value) {
			this.attr[key] = value;
			return value;
		},
		get: function (key) {
			return this.attr[key];
		},

		extendFromObj: function (data) {
			_.extend(this.attr, data);
		},

		touchStartAutoScroll: function (e) {

			if ( !this.info.get('isIOS', true) ) { // do for IOS only
				return;
			}

			var $wrapper = $(e.currentTarget),
				$scrollArea = $wrapper.find('> div'),
				scrollTop = $wrapper.scrollTop(),
				wrapperHeight,
				scrollAreaHeight,
				maxScrollTop;

			if (scrollTop <= 0) {
				$wrapper.scrollTop(1);
				return;
			}

			wrapperHeight = $wrapper.outerHeight();
			scrollAreaHeight = $scrollArea.outerHeight();
			maxScrollTop = scrollAreaHeight - wrapperHeight;

			if ( scrollTop >= maxScrollTop ) {
				$wrapper.scrollTop(maxScrollTop - 1);
			}

		},

		tabAction: function (e) {

			var view = this,
				$el = view.$el,
				$button = $(e.currentTarget),
				tabId = $button.attr('data-tab-id'),
				tabState = $button.attr('data-tab-state'),
				tabButtonClassPrefix = 'tab-button-',
				tabBlockSelector = '.js-tab-block',
				tabButtonSelector = '.js-tab-button',
				$block = $el.find(tabBlockSelector + '[data-tab-id="' + tabId + '"]'),
				$blocks = $el.find(tabBlockSelector),
				$buttons = $el.find(tabButtonSelector);

			$blocks.addClass('hidden');
			$buttons
				.addClass(tabButtonClassPrefix + 'close')
				.removeClass(tabButtonClassPrefix + 'open')
				.attr('data-tab-state', 'close');

			if (tabState === 'close') {
				$button
					.attr('data-tab-state', 'open')
					.removeClass(tabButtonClassPrefix + 'close')
					.addClass(tabButtonClassPrefix + 'open');
				$block.removeClass('hidden');
			}

		},

		tabClose: function () {

			var view = this,
				$el = view.$el,
				tabButtonClassPrefix = 'tab-button-',
				tabBlockSelector = '.js-tab-block',
				tabButtonSelector = '.js-tab-button',
				$blocks = $el.find(tabBlockSelector),
				$buttons = $el.find(tabButtonSelector);

			$blocks.addClass('hidden');
			$buttons
				.addClass(tabButtonClassPrefix + 'close')
				.removeClass(tabButtonClassPrefix + 'open')
				.attr('data-tab-state', 'close');

		},

		playSound: function (e) {

			var $this = $(e.currentTarget),
				sound = $this.attr('data-sound');

			win.APP.soundMaster.play({
				sound: sound,
				road: 3,
				isLoop: false
			});

		},

		autoShowHelpButton: function () {

			var view = this,
				info = view.info,
				isShow = info.get('help'),
				$helpButton = view.$wrapper.find('.js-help-button');

			if (isShow === 'on') {
				$helpButton.removeClass('hidden');
			} else {
				$helpButton.addClass('hidden');
			}

		},

		changeOnOffSetting: function (e) {

			var view = this,
				$wrapper = $(e.currentTarget),
				$this = $wrapper.find(view.selectors.onOffSetting),
				key = $this.attr('data-key'),
				value = ( $this.attr('data-value') === 'on' ) ? 'off' : 'on',
				settingsPrototype = win.APP.BB.SettingsView.prototype;

			if ( value === 'on' ) {
				$this.addClass('on-off-enable');
			} else {
				$this.removeClass('on-off-enable');
			}

			$this.attr( 'data-value', value );
			view.info.set(key, value);

			switch (key) {

				case 'help':
					view.autoShowHelpButton();
					break;

				case 'buildingSmoke':
					settingsPrototype.autoShowBuildingSmoke();
					break;

				case 'unitAnimation':
					settingsPrototype.autoShowUnitAnimation();
					break;

				case 'music':
					settingsPrototype.autoSetMusic();
					break;

			}

		},

		changeSelectSetting: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				key = $this.attr('data-key'),
				value = $this.attr('data-value'),
				$nodes = view.$el.find('.js-change-select-setting[data-key="' + key + '"]'),
				settingsPrototype = win.APP.BB.SettingsView.prototype;

			$nodes.addClass('opacity50');
			$nodes.removeClass('selected-in-list');

			$this.removeClass('opacity50');
			$this.addClass('selected-in-list');

			view.info.set(key, value);

			switch (key) {

				case 'language':
					win.APP.lang.set(value);
					new view.constructor(view.get('args')); // do not use this.loadUrl(); cause this view used in battle view
					break;

				case 'gameSpeed':
					settingsPrototype.setSpeedStyle();
					break;

				case 'font':
					settingsPrototype.autoSetFont();
					break;

			}

		}


	});

	proto = win.APP.BB.BaseView.prototype;

	proto.tmpl = win.APP.templateMaster.tmplFn;
	proto.proto = proto;
	proto.info = win.APP.info;

	proto.util = {
		toTop: function () {
			win.scrollTo(0, 0);
		},
		setSizes: function () {

			log('set sizes');

		},
		onResize: function () {
			log('on resize');
			this.setSizes();
		},
		init: function () {
			win.addEventListener('resize', this.onResize.bind(this), false);
		},
		copyJSON: function (obj) { // external
			return JSON.parse(JSON.stringify(obj));
		},
		hideSymbols: function (str, sign) {
			sign = sign || '?';
			return str.toString().replace(/[\d\w]/g, sign);
		},
		//themeList: ['coffee', 'black-coffee', 'owl', 'owl owl-black'],
		//themeDefault: 'coffee',
		//
		//setTheme: function (themeName) {
		//
		//	var $body = $(doc.body);
		//
		//	_.each(this.themeList, function (themeName) {
		//		$body.removeClass(themeName);
		//	});
		//
		//	$body.addClass(themeName);
		//
		//	win.APP.info.set('theme', themeName);
		//
		//},
		//loadSavedTheme: function () {
		//
		//	var themeName = win.APP.info.get('theme') || this.themeDefault;
		//
		//	this.setTheme(themeName);
		//
		//},
		runIfConnect: function (calback, context) {
			var img = new Image();
			img.addEventListener('load', calback.call(context), false);
			img.src = 'http://statlex.com/i/statlex-icon.png?t=' + Date.now();
		},
		getXYFromStringXY: function (xy) {
			return {
				x: parseInt(xy.replace(/^x(\-?\d+)y\d+$/, '$1'), 10),
				y: parseInt(xy.replace(/^x\d+y(\-?\d+)$/, '$1'), 10)
			};
		},
		getStringFromXY: function (x, y) {
			return 'x' + x + 'y' + y;
		},
		getXyFromStyle: function (style) {
			var xy = style.replace(/^[\s\S]+translate3d\(/, '').match(/\-?\d+(\.\d*)?/g);

			return {
				x: parseInt(xy[0], 10),
				y: parseInt(xy[1], 10)
			};
		},
		findIn: function (context, selector) {
			return context.querySelector(selector);
		},
		findInAll: function (context, selector) {
			return Array.prototype.slice.call(context.querySelectorAll(selector));
		}

	};

	proto.util.init();

}(window, document));