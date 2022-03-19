(function (win, doc) {

	"use strict";
	/*global window, document, navigator */

	var WITH_ADS = true;

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

		withAds: WITH_ADS,

		link: {
			ios: {
				//normal: 'https://itunes.apple.com/us/app/ancient-empire-strike-back/id1000811506?mt=8',
				//pro: 'https://itunes.apple.com/us/app/ancient-empire-strike-back/id995589839?mt=8'
			},
			android: {
				normal: 'https://play.google.com/store/apps/details?id=com.statlex.ancientempires',
				pro: 'https://play.google.com/store/apps/details?id=com.statlex.ancientempirespro'
			}
		},

		lang: 'en', // current language
//		availableLangs: ['en', 'ru', 'de', 'zh', 'es', 'ar', 'it'],
		availableLangs: ['en', 'ru'],
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

			this.setOS();

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
			gameSpeed: 3,
			lang: 'en'
		},
		openMissions: ['c01_regroup'],
		pushNewMission: function (missionJsName) {
			var arr = this.get('openMissions');

			if (arr.indexOf(missionJsName) === -1) {
				arr.push(missionJsName);
			}

			this.set('openMissions', arr, true);
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
			}

			if (isIOS) {
				this.set('os', 'ios', true);
			}

		}

	};

	info.init();

	win.info = info;

}(window, document));
