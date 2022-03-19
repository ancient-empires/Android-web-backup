/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window, setTimeout */
	/*global Backbone, APP, $ */

	win.APP = win.APP || {};

	APP.BB = APP.BB || {};

	APP.BB.Router = Backbone.Router.extend({

		routes: {
			'': 'title',
			'settings': 'settings',
			'play': 'play',
			'about': 'about',
			'instructions': 'instructions',
			'load-game': 'loadGame',
			'select-level': 'selectLevel',
			'skirmish-select-map': 'skirmishSelectMap',
			'user-map-select-map': 'userMapSelectMap',
			'mission-setup-map/:jsMapKey': 'missionSetupMap',
			'skirmish-setup-map/:jsMapKey': 'skirmishSetupMap',
			'user-map-setup-map/:jsMapKey': 'userMapSetupMap',
			'battle': 'battle',
			'main-battle-menu': 'mainBattleMenu',
			'map-editor': 'mapEditor'
		},

		title: function () {
			new APP.BB.TitleView();
		},

		settings: function () {
			new APP.BB.SettingsView();
		},

		play: function () {
			new APP.BB.PlayView();
		},

		about: function () {
			new APP.BB.AboutView();
		},

		instructions: function () {
			new APP.BB.InstructionsView();
		},

		loadGame: function () {
			new APP.BB.LoadGameView();
		},

		selectLevel: function () {
			new APP.BB.SelectLevelView();
		},

		skirmishSelectMap: function () {
			new APP.BB.SkirmishSelectMapView();
		},

		userMapSelectMap: function () {
			new APP.BB.SkirmishSelectMapView({
				type: 'userMap'
			});
		},

		skirmishSetupMap: function (jsMapKey) {
			new APP.BB.SkirmishSetupMapView(jsMapKey);
		},

		userMapSetupMap: function (jsMapKey) {
			new APP.BB.SkirmishSetupMapView(jsMapKey, { type: 'userMap' });
		},

		missionSetupMap: function (jsMapKey) {
			new APP.BB.SkirmishSetupMapView(jsMapKey, {type: 'mission'});
		},

		battle: function () {

			$('.js-unit-store-wrapper')
				.trigger('hide-unit-store');

			$('.js-battle-menu-wrapper')
				.trigger('hide-battle-menu');

			$('.js-settings-wrapper')
				.trigger('hide-battle-setting');

			$('.js-move-area-container')
				.removeClass('hidden');

		},

		mainBattleMenu: function () {

		},

		mapEditor: function () {
			new APP.BB.MapEditorView();
		},

		constructor: function () {

			var router = this,
				originalFunctions = {},
				proto = APP.BB.Router.prototype;

			function getAction() {

				var e = window.event || {},
					newURL = e.newURL || '',
					oldURL = e.oldURL || '',
					reBattle = /#battle$/,
					reMapEditor = /#map-editor$/,
					popupPart = APP.BB.BaseView.prototype.popupUrl,
					viewAction;

				if ( newURL.indexOf(popupPart) !== -1 ) {
					viewAction = 'showPopup';
				}

				if ( oldURL.indexOf(popupPart) !== -1 ) {
					viewAction = 'hidePopup';
				}

				if ( router.isForce ) {
					return viewAction;
				}

				if ( reBattle.test(oldURL) ) {
					viewAction = 'routeFromBattle';
				}

				if ( reMapEditor.test(oldURL) ) {
					viewAction = 'routeFromMapEditor';
				}

				return viewAction;

			}

			_.each(this.routes, function (value) {
				originalFunctions[value] = proto[value];
				proto[value] = function () {

					var router = this,
						viewAction = getAction(),
						baseProto = win.APP.BB.BaseView.prototype,
						d;
						//battleData = win.APP.bb.battleData;

					if ( !viewAction ) {
						return originalFunctions[value].apply(router, arguments);
					}

					switch (viewAction) {
						
						case 'hidePopup':
							baseProto.hidePopup();
							//if ( battleData.isEndGame === 'yes' && battleData.gameTo === 'quit') {
							//	router.routeFromBattle();
							//}

							break;							
							
						case 'showPopup':

							break;							
							
						case 'routeFromBattle':

							//if ( battleData.isEndGame !== 'yes' ) {
								baseProto.routeByUrl('battle');
								baseProto.showPopup({
									popupName: 'route-from-battle'
								});
							//}

							break;

						case 'routeFromMapEditor':

							baseProto.routeByUrl('map-editor');
							baseProto.showPopup({
								popupName: 'route-from-map-editor'
							});

							break;

					}

				};

			});

			return Backbone.Router.prototype.constructor.apply(this, arguments);

		}
		//,
		//
		//routeFromBattle: function () {
		//	var baseProto = win.APP.BB.BaseView.prototype;
		//	baseProto.routeBack();
		//	setTimeout(function () {
		//		baseProto.routeBack();
		//	}, 50);
		//
		//}

	});


	if ($.browser.mozilla) {
		window.addEventListener("hashchange", function (e) {
			window.event = e;
		}, true);
	}

}(window));