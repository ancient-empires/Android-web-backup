(function (win, doc) {

	"use strict";
	/*global window, document */
	/*global templateMaster, lang, Backbone, APP, info, history, setTimeout, $, util */

	win.lang.push('en');

	window.APP = window.APP || {};

	var Router;

	Router = Backbone.Router.extend({

		routes: {
			'': 'title',
			'battle': 'battle',
			'store': 'store',
			'maps': 'maps',
			'create-map': 'createMap',
			'companies': 'companies',
			'setting': 'setting',
			'instruction': 'instruction',
			'credits': 'credits'
		},

		title: function () {

			APP.titleView = new APP.TitleView({ currentView: APP.titleView });

		},

		battle: function () {

			var $block = $('.js-wrapper .js-status-bar');
			$block.removeClass('in-store');

			APP.removeExtraView();

			$('.js-hide-for-store').removeClass('visibility-hidden');

		},

		store: function () {

			var $block = $('.js-wrapper .js-status-bar');

			$block.addClass('in-store');

			$('.js-hide-for-store').addClass('visibility-hidden');

		},

		maps: function() {

			if ( /^[\s\S]+?#battle$/.test(event.oldURL) && APP.battleView && !APP.battleView.doNotShowConfirm) {

				if ( confirm('Are you sure to leave mission?') ) {
					APP.mapsView = new APP.MapsView({ type: 'skirmish' });
				} else {
					history.forward();
				}
				return;
			}

			APP.mapsView = new APP.MapsView({ type: 'skirmish' });

		},

		createMap: function() {

			new APP.CreateMapView();

		},
		companies: function () {

			var data = { type: 'mission' };

			if ( /^[\s\S]+?#battle$/.test(event.oldURL) && APP.battleView && !APP.battleView.doNotShowConfirm) {

				if ( confirm('Are you sure to leave mission?') ) {
					APP.mapsView = new APP.MapsView(data);
				} else {
					history.forward();
				}
				return;
			}

			APP.mapsView = new APP.MapsView(data);

		},
		setting: function () {
			new APP.SettingView();

		},
		instruction: function () {
			APP.instructionView = new APP.InstructionView();
		},
		credits: function () {
			APP.creditsView = new APP.CreditsView();
		}

	});

	APP.router = new Router();

	APP.removeExtraView = function() {
		$('.js-store-wrapper').remove();
		$('.js-battle-menu-wrapper').remove();
	};

	// start of app here
	function main() {

		// default language
		win.lang.push(win.info.lang);

		templateMaster.init();
		APP.notificationView = new APP.NotificationView();
		Backbone.history.start();

		util.setWrapperStyle($('body'));

		function back() {
			if (win.location.hash) {
				history.back();
				setTimeout(back, 50);
			}
		}

		back();

	}


	win.addEventListener('load', main, false);

	// other data here

}(window, document));