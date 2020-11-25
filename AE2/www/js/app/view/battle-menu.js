/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */
	/*global $, templateMaster, APP, Backbone */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.BattleMenuView = APP.BB.BaseView.extend({

		selectors: {
			'battleMenuWrapper': '.js-battle-menu-static-wrapper'
		},

		settings: {
			url: 'main-battle-menu'
		},

		events: {
			'click .js-popup-container': 'stopEvent',
			'hide-battle-menu': 'hide',
			'click .js-restart-battle': 'restartBattle',
			'click .js-quit-battle': 'quitBattle',
			'click .js-show-objective': 'showObjective',
			'click .js-show-settings': 'showSettings',
			'click .js-show-save-state': 'showSaveState',
			'click .js-show-load-state': 'showLoadState'
		},

		initialize: function (data) {

			var view = this;

			if (Backbone.history.fragment !== view.settings.url) {
				view.navigate(view.settings.url);
			}

			view.extendFromObj(data);

			view.proto.initialize.apply(view, arguments);

			view.render();

		},

		render: function () {

			var view = this,
				battleView = view.get('view'),
				$menuWrapper = battleView.$el.find(view.selectors.battleMenuWrapper),
				$contentWrapper = $(view.tmpl['popup-wrapper']()),
				$content = $(view.tmpl['battle-menu']());

			$contentWrapper.removeClass('js-popup-wrapper').addClass('js-battle-menu-wrapper battle-menu-wrapper');

			$contentWrapper.find('.js-popup-container').html($content.html());

			view.$el = $contentWrapper;

			$menuWrapper.append(view.$el);

		},

		restartBattle: function () {

			var view = this;

			view.routeBack();

			view.showPopup({
				popupName: 'popup-confirm-restart-battle',
				parentView: view.get('view')
			});

		},

		quitBattle: function () {

			var view = this;

			view.routeBack();

			view.showPopup({
				popupName: 'popup-confirm-quit-battle',
				parentView: view.get('view')
			});

		},

		showObjective: function () {

			var view = this;

			view.routeBack();
			view.get('view').showObjective();

		},

		showSettings: function () {

			var view = this;

			view.routeBack();

			setTimeout(function () {
				new win.APP.BB.SettingsView({
					view: view.get('view')
				});
				view.routeByUrl('battle-settings');
			}, 50);

		},

		showSaveState: function () {

			var view = this,
				battleView = view.get('view'),
				battleModel = battleView.get('model'),
				map = battleModel.get('map'),
				saveGameView;

			saveGameView = new win.APP.BB.SaveGameView({
				battleView: battleView,
				battleModel: battleModel
			});

			view.showPopup({
				popupName: 'simple-notification',
				append$el: saveGameView.$el,
				cssClass: 'no-image-border'
			});

		},

		showLoadState: function () {

			var view = this,
				battleView = view.get('view'),
				battleModel = battleView.get('model'),
				map = battleModel.get('map'),
				loadGameView;

			loadGameView = new win.APP.BB.LoadGamePopupView({
				battleView: battleView,
				battleModel: battleModel
			});

			view.showPopup({
				popupName: 'simple-notification',
				append$el: loadGameView.$el,
				cssClass: 'no-image-border'
			});

		}

	});

}(window));
