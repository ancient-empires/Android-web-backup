(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.PlayView = APP.BB.BaseView.extend({

		selectors: {
			startGame: '.js-start-game'
		},

		events: {
			'click .js-start-game': 'startGame'
		},

		initialize: function () {

			this.$el = $(this.tmpl.play());

			this.proto.initialize.apply(this, arguments);

			this.render();

		},

		startGame: function () {
			this.routeByUrl('select-level', {trigger: false});

			new APP.BB.SelectLevelView({
				newGame: true
			});

		}

	});

}(window));
