(function (win, doc) {

	"use strict";
	/*global window, document, navigator */

	function getPrefix() {

		var data = {
				js: '',
				css: ''
			},
			tempStyle = doc.createElement('div').style,
			vendors = ['t','webkitT','MozT','msT','OT'];

		// find vendors by css transform property
		vendors.forEach(function(vendor){
			var transform = vendor + 'ransform';
			if (!tempStyle.hasOwnProperty(transform)) {
				return;
			}

			vendor = vendor.replace(/t$/i, ''); // remove 't' from vendor

			data = {
				js: vendor,
				css: '-' + vendor.toLocaleLowerCase() + '-'
			};

		});

		return data;

	}

	var docElem, ls, isTouch, info, pre;
	docElem = doc.documentElement;
	ls = win.localStorage;
	isTouch = docElem.hasOwnProperty('ontouchstart');
	pre = getPrefix();

	info = {
		lang: 'en', // current language
//		availableLangs: ['en', 'ru', 'de', 'zh', 'es', 'ar', 'it'],
		availableLangs: ['en'],
		saveItem: 'ancient-empires-ls-item',
		isPhone: false,
		isTouch: isTouch,
		preCSS: pre.css,
		preJS: pre.js,
		isAndroid: (/android/i).test(win.navigator.userAgent),
		isIOS: /iPad|iPhone|iPod/.test(win.navigator.userAgent),

		canScroll: false,

		getData: function () {
			var data = ls.getItem(this.saveItem) || '{}';
			return JSON.parse(data);
		},
		get: function (key) {
			return this[key];
		},
		set: function (key, value, toLS) {
			this[key] = value;

			if (!toLS) {
				return;
			}

			// save data to ls
			var data = this.getData();
			data[key] = value;
			data = JSON.stringify(data);
			ls.setItem(this.saveItem, data);
		},
		change: function (key, delta, toLS) {
			this.set(key, (this.get(key) || 0) + delta, toLS);
		},

		init: function () {

			this.getIsPhone();

			// set all fields from ls to info
			this.setDataFromLS();

			// try to get current language
			var lang = this.get('lang') || (navigator.language || navigator.userLanguage);
			lang = lang.split('-')[0];
			this.lang = (this.availableLangs.indexOf(lang) === -1) ? this.lang : lang;

		},
		setDataFromLS: function () {
			var data = this.getData(),
				key;
			for (key in data) {
				if (data.hasOwnProperty(key)) {
					this[key] = data[key];
				}
			}
		},
		getIsPhone: function () {
			var maxSize = (docElem.clientHeight > docElem.clientWidth) ? docElem.clientHeight : docElem.clientWidth;
			this.isPhone = maxSize < 700;
			return this.isPhone;
		},

		setting: {
			endTurnConfirm: false,
			music: false,
			gameSpeed: 3
		},
		openMissions: ['c01_regroup'],
		pushNewMission: function (missionJsName) {
			var arr = this.get('openMissions');
			arr.push(missionJsName);
			this.set('openMissions', arr, true);
		}

	};

	info.init();

	win.info = info;

}(window, document));
