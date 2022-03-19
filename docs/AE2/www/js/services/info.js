/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win, doc, docElem) {

	"use strict";
	/*global window, document, navigator, localStorage */
	/*global APP */

	win.APP = win.APP || {};

	function getPrefix() {

		var data = {
				js: '',
				css: ''
			},
			tempStyle = doc.createElement('div').style,
			vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];

		// find vendors by css transform property
		vendors.forEach(function (vendor) {
			var transform = vendor + 'ransform';
			if (!tempStyle.hasOwnProperty(transform)) {
				return;
			}

			vendor = vendor.replace(/t$/i, ''); // remove 't' from vendor

			data.js = vendor;

			vendor = vendor.toLocaleLowerCase();
			if (vendor) {
				data.css = '-' + vendor + '-';
			}

		});

		return data;

	}

	var info;

	info = {

		withAds: true,

		link: {
			ios: {
				normal: '',
				pro: ''
			},
			android: {
				normal: 'https://play.google.com/store/apps/details?id=com.statlex.ancientempirestrikeback',
				pro: 'https://play.google.com/store/apps/details?id=com.statlex.ancientempirestrikebackup'
			}
		},

		ls: win.localStorage,
		saveItem: 'ae2-ls-item',
		attr: {},
		systemAttr: {},
		defaultLanguage: 'en',
		//availableLanguages: ['en'],
		availableLanguages: ['en', 'es', 'ru', 'zh'],
		availableFonts: [
			{
				id: 'courier',
				cssClass: 'font-courier'
			},
			{
				id: 'lucida',
				cssClass: 'font-lucida'
			},
			{
				id: 'pixel',
				cssClass: 'font-pixel'
			}
		],

		init: function () {

			var lang;

			// get data from LS
			this.attr = JSON.parse(this.ls.getItem(this.saveItem) || '{}');

			// set vendor prefix
			this.set('pre', getPrefix(), true);

			// is touch
			this.set('isTouch', 'ontouchstart' in document, true);

			// is phone
			this.set('isPhone', Math.max(docElem.clientHeight, docElem.clientWidth) <= 736, true); // 736 msx of iPhone6plus

			this.setOS();

			// set language
			lang = this.get('language') || navigator.language || navigator.userLanguage || this.defaultLanguage;
			lang = lang.split('-')[0].toLocaleLowerCase();
			lang = (this.availableLanguages.indexOf(lang) === -1) ? this.defaultLanguage : lang;
			lang = lang.toLowerCase();
			this.set('language', lang);

			//set settings
			this.setSettings();

			this.detectTransitionEndEventName();
			this.detectAnimationEndEventName();

		},
		setOS: function () {

			var ua = win.navigator.userAgent,
				isIE = /MSIE/.test(ua),
				isAndroid = (/android/i).test(ua),
				isIOS = /iPad|iPhone|iPod/.test(ua);

			this.set('isIE', isIE, true);
			this.set('isAndroid', isAndroid, true);
			this.set('isIOS', isIOS, true);

			if (isIE) {
				this.set('os', 'wp', true);
			}

			if (isAndroid) {
				this.set('os', 'android', true);
				this.set('android-version', this.getAndroidVersion(), true);

			}

			if (isIOS) {
				this.set('os', 'ios', true);
			}

		},

		getAndroidVersion: function () {

			var match = win.navigator.userAgent.toLowerCase().match(/android\s([0-9\.]*)/);

			return match ? match[1] : false;

		},

		detectTransitionEndEventName: function () {

			var i,
				el = doc.createElement('div'),
				transitions = {
					'transition':'transitionend',
					'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
					'MozTransition':'transitionend',
					'WebkitTransition':'webkitTransitionEnd'
				},
				transitionEnd = 'transitionend';

			for (i in transitions) {
				if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
					transitionEnd = transitions[i];
				}
			}

			this.set('transitionEnd', transitionEnd, true);

		},

		detectAnimationEndEventName: function () {
			var i,
				el = doc.createElement('div'),
				animations = {
					'animation':'animationend',
					'OAnimation':'oAnimationEnd',  // oAnimationEnd in very old Opera
					'MozAnimation':'animationend',
					'WebkitAnimation':'webkitAnimationEnd'
				},
				animationEnd = 'animationend';

			for (i in animations) {
				if (animations.hasOwnProperty(i) && el.style[i] !== undefined) {
					animationEnd = animations[i];
				}
			}

			this.set('animationEnd', animationEnd, true);

		},

		set: function (key, value, isSystem) {

			if (isSystem) {
				this.systemAttr[key] = value;
			} else {
				this.attr[key] = value;
				this.ls.setItem(this.saveItem, JSON.stringify(this.attr));
			}


			return true;

		},

		get: function (key, isSystem) {
			return isSystem ? this.systemAttr[key] : this.attr[key];
		},

		remove: function (key, isSystem) {
			if (isSystem) {
				this.systemAttr[key] = null;
				delete this.systemAttr[key];
			} else {
				this.attr[key] = null;
				delete this.attr[key];
				this.ls.setItem(this.saveItem, JSON.stringify(this.attr));
			}

			return key;

		},

		setSettings: function () {

			var defaultSettings = {
					autoSave: 'on', // auto save game after every turn
					confirmTurn: 'off', // game turn
					confirmMove: 'off', // move unit
					confirmAttack: 'off', // attack unit
					music: 'on',
					vibrate: 'off',
					help: 'on',
					fightAnimation: 'off',
					buildingSmoke: 'off',
					unitAnimation: 'off',
					font: 'lucida',
					difficult: 'easy', // easy, normal, hard
					gameSpeed: '3' // 1..5, use string type
				},
				key,
				value;

			for (key in defaultSettings) {
				if (defaultSettings.hasOwnProperty(key)) {
					value = this.get(key) || defaultSettings[key];
					this.set(key, value);
				}
			}

		},

		actionTime: function () {

			var info = this,
				speed = parseInt(info.get('gameSpeed'), 10),
				q = 6 - speed; // 6 === maxSpeed'5' + 1

			return 300 + (q - 1) * 100;

		},

		getLinkToStore: function (type) { // pro or normal
			return this.link[this.get('os', true)][type || 'normal'];
			//return this.link[this.get('os', true)][type || (this.isNormal ? 'normal' : 'pro')];
		}

	};

	info.init();

	win.APP.info = info;

}(window, document, document.documentElement));
