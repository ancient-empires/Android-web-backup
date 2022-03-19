/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.TitleView = APP.BB.BaseView.extend({

		events: {
			'press .js-unlock-all-levels': 'unlockAllLevels'
		},

		selectors: {
			unlockAllLevels: '.js-unlock-all-levels'
		},

		initialize: function () {

			var view = this;

			view.$el = $(view.tmpl.title());

			view.proto.initialize.apply(view, arguments);

			view.render();

			log('do not show showRateUs');
			//this.showRateUs();

		},

		unlockAllLevels: function () {

			var view = this;

			view.$el.find(view.selectors.unlockAllLevels).html('Developer<br>mode enabled').css('opacity', '1');
			view.info.set('isTestMode', true, true);
			view.info.set('noAds', true);

		},

		showRateUs: function () {

			this.util.runIfConnect(function () {
				setTimeout(function () {
					win.APP.bb.rate = new win.APP.BB.RateView();
					win.APP.bb.rate.show();
				}, 50);
			}, this);

		}

	});

}(window));