(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	var d = 86400e3; // d -> day -> 86400sec -> 86400 000

	APP.BB.RateView = APP.BB.BaseView.extend({

		events: {
			'click .js-five-stars': 'fiveStars'
		},

		showPeriod: 3 * d,

		initialize: function () {

			var os = this.info.get('os', true),
				level = this.info.withAds ? 'normal' : 'pro',
				link = this.info.link[os][level];

			this.$el = $(this.tmpl.rate({ link: link }));

			return this;

		},
		show: function () {

			var rateData = this.info.get('rate') || {},
				isRated = rateData.isRated,
				now = Date.now(),
				lastShowTime = rateData.lastShowTime;

			// if it is first time for show
			// we set last show time to now
			// to do not show rate us on first time
			if ( !lastShowTime ) {
				rateData.lastShowTime = now;
				lastShowTime = now;
				this.info.set('rate', rateData);
				return;
			}

			// check for rate
			if (isRated) {
				return;
			}

			//check for last show time
			if (now - lastShowTime < this.showPeriod) {
				return;
			}

			// save last show date
			rateData.lastShowTime = now;
			this.info.set('rate', rateData);

			this.routeToPopup();

			this.proto.initialize.apply(this, arguments);

			this.render();

		},
		render: function () {

			this.$wrapper.append(this.$el);

		},

		fiveStars: function () {

			var rateData = this.info.get('rate') || {};
			rateData.isRated = true;
			this.info.set('rate', rateData);

			this.routeBack();


		}

	});

}(window));