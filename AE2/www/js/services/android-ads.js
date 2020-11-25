/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window, console */
	/*global */

	win.Android = win.Android || {
			displayInterstitial: function () {
				console.log('AD - ad has been shown !!!');
			}
		};

	var info = win.APP.info,

		androidAds = {
			attr: {},
			minShowPeriod: 4 * 60e3,
			set: function (key, value) {
				this.attr[key] = value;
				return this;
			},
			get: function (key) {
				return this.attr[key];
			},
			showAd: function () {

				var ad = this,
					now;

				console.log('AD - --------------');
				console.log('AD - try to show ad');

				if (!info.withAds) {
					return;
				}

				console.log('AD - app WITH ads');

				now = Date.now();

				if (now - ad.get('lastShow') >= ad.minShowPeriod) {
					ad.set('lastShow', now);
					win.Android.displayInterstitial();
				} else {
					console.log('AD - time from last show is not over');
				}

			},

			init: function () {

				var ad = this;

				ad.set('lastShow', 0);

				ad.showAd = ad.showAd.bind(ad);

			}

		};

	androidAds.init();

	win.APP.androidAds = androidAds;

}(window));

