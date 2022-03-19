(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.LoadGameView = APP.BB.BaseView.extend({

		events: {
			'click .js-load-game': 'loadGame'
		},

		initialize: function () {

			var view = this,
				dbMaster = win.APP.map.db;


			dbMaster.getSavedGames().then(function (savedGames) {
				view.$el = $(view.tmpl.loadGame({ savedGames: savedGames }));
				view.proto.initialize.apply(view, arguments);
				view.render();
			});

		},

		loadGame: function (e) {

			var view = this,
				dbMaster = win.APP.map.db,
				$this = $(e.currentTarget),
				gameName = $this.attr('data-save-name');

			dbMaster.getSavedGame(gameName).then(function (data) {
				var game = JSON.parse(data.game);
				game.fromSave = true;
				new win.APP.BB.BattleView(game);
			});

			view.routeByUrl('battle', { trigger: true });

		}

	});

}(window));
