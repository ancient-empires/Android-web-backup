(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.SelectLevelView = APP.BB.BaseView.extend({

		events: {

		},

		initialize: function (data) {

			data = data || {};

			var view = this;

			win.APP.map.db.getMapsInfo({ type: 'mission' }).then(function (mapsInfo) {

				view.$el = $(view.tmpl.selectLevel({
					mapsInfo: mapsInfo
				}));

				view.proto.initialize.apply(view, arguments);

				if (data.newGame) {
					view.routeByUrl('mission-setup-map/mission_001_001', { trigger: true });
					return;
				}

				view.render();

			});

		}

	});

}(window));
