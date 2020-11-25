/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.SettingsView = APP.BB.BaseView.extend({

		selectors: {
			settingsWrapper: '.js-battle-settings-wrapper',
			onOffSetting: '.js-change-on-off-setting',
			style: '.js-game-speed-style'
		},

		events: {
			//'click .js-change-on-off-setting-wrapper': 'changeOnOffSetting',
			//'click .js-change-select-setting': 'changeSelectSetting', // see base view
			'click .js-setting-item-wrapper': 'changeSettings',
			'hide-battle-setting': 'hide'
		},

		initialize: function (data) {

			var view = this,
				isBattleState = /^battle/.test(Backbone.history.fragment);

			view.$el = $(this.tmpl.settings({ view: view, info: view.info, isBattleState: isBattleState }));

			view.extendFromObj(data);

			view.set('args', data);

			view.proto.initialize.apply(view, arguments);

			view.render();

		},

		render: function () {

			var view = this,
				$mainWrapper = view.$wrapper,
				$wrapper = $mainWrapper.find(view.selectors.settingsWrapper),
				battleView = view.get('view');

			if ($wrapper.length) {
				$wrapper.empty().append(view.$el);
				battleView.$el.find(battleView.selectors.moveAreaContainer).addClass('hidden');
				return;
			}

			view.proto.render.call(view);

		},


		setSpeedStyle: function () {

			var view = this,
				speed = parseInt(view.info.get('gameSpeed'), 10),
				time = view.info.actionTime(),
				$style = view.tmpl['game-speed']({time: time - 100});

			view.$wrapper.find(view.selectors.style).remove().empty();

			view.$wrapper.append($style);

		},

		autoShowBuildingSmoke: function () {

			var view = this,
				info = view.info,
				smokeState = info.get('buildingSmoke'),
				battleView = $('.js-battle-view-wrapper');

			// todo: do the same for autoShowUnitAnimation

			if (!battleView.length) {
				return;
			}

			if (smokeState === 'on') {
				battleView.trigger('showHouseSmoke');
			} else {
				battleView.trigger('hideHouseSmoke');
			}

		},

		autoShowUnitAnimation: function () {

			var view = this,
				info = view.info,
				unitAnimationState = info.get('unitAnimation');

			if (unitAnimationState === 'on') {
				view.$wrapper.removeClass('hide-unit-animation');
			} else {
				view.$wrapper.addClass('hide-unit-animation');
			}

		},

		autoSetFont: function () {

			var view = this,
				info = view.info,
				fontId = info.get('font'),
				allFonts = info.availableFonts,
				font = _.find(allFonts, { id: fontId }),
				$body = $(win.document.body);

			_.each(allFonts, function (font) {
				$body.removeClass(font.cssClass);
			});

			$body.addClass(font.cssClass);

		},

		autoSetMusic: function () {

			var view = this,
				info = view.info,
				musicState = info.get('music'),
				soundMaster = win.APP.soundMaster;

			if (musicState === 'on') {
				soundMaster.restoreBgSound();
			} else {
				soundMaster.stopBgSound();
			}

		}

	});

}(window));
