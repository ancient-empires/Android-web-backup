(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP */

	win.APP = win.APP || {};

	APP.TitleView = APP.BaseView.extend({

		templates: ['title'],

		events: {
			'click .js-go-to-select-map': 'goToSelectMap',
			'click .js-create-map': 'goToCreateMap',
			'click .js-go-to-companies': 'goToCompanies',
			'click .js-go-to-settings': 'goToSetting',
			'click .js-instruction': 'goToInstruction',
			'click .js-to-credits': 'goToCredits',
			'click .js-external-link': 'toExternalLink'
		},

		init: function() {

			APP.notificationView.hideExtraWindows();

			this.$el = $(this.tmpl.title());

			this.$wrapper = $('.js-wrapper');

			this.$wrapper.html('');

			this.$wrapper.append(this.$el);

			this.setSettings();

		},

		goToCredits: function () {
			APP.router.navigate('credits', { trigger: true });
		},

		goToSelectMap: function() {
			APP.router.navigate('maps', { trigger: true });
		},

		goToCreateMap: function() {
			APP.router.navigate('create-map', { trigger: true });
		},
		goToCompanies: function () {

			APP.router.navigate('companies', { trigger: true });

		},
		goToSetting: function () {
			APP.router.navigate('setting', { trigger: true });

		},

		setSettings: function () {
			var setting =  win.info.get('setting');
			// set game speed
			APP.units.info.timer = APP.units.info.timersBySpeed[setting.gameSpeed];
		},

		goToInstruction: function () {
			APP.router.navigate('instruction', { trigger: true });
		},

		toExternalLink: function(e) {

			e.preventDefault();
			e.stopPropagation();

			var $this = $(e.target),
				url = $this.attr('href');

			win.open(url);

		}


	});

}(window));