(function (win) {

	"use strict";
	/*global window, document, setTimeout */
	/*global bingo, $, info, APP, util */

	win.APP = win.APP || {};

	APP.BattleMenuView = APP.BaseView.extend({
		templates: ['battle-menu'],

		events: {
			'click .js-restart-mission': 'restartMission',
			'click .js-quit-mission': 'quitMission'
		},

		init: function (data) {

			data.objective = (data.jsMapName && win.langs[win.info.lang].missions[data.jsMapName]) ? win.langs[win.info.lang].missions[data.jsMapName].objective : lang.occupyAllBuildings;

			this.$el = $(this.tmpl['battle-menu'](data));

			this.$wrapper = $('.js-wrapper');
			this.$wrapper.find('.js-battle-menu-wrapper').remove();

			this.setSettingsState();

			this.$wrapper.append(this.$el);

		},

		restartMission: function () {

			this.$el.addClass('hidden');

			win.history.back();

			APP.battleView = new APP.BattleView(util.createCopy(APP.battleView.startingData));

		},

		quitMission: function () {

			if (this && this.$el) {
				this.$el.addClass('hidden');
			}

			var history = win.history;
			history.back();

			APP.battleView.doNotShowConfirm = true;

			setTimeout(history.back.bind(history), 100);

		},
		setSettingsState: function () {

			APP.SettingView.prototype.setSettingsState.call(this);

		}

	});

}(window));