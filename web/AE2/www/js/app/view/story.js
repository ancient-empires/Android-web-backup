/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global console, alert, window, document, setTimeout, clearTimeout */
	/*global APP, $, Backbone*/

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.StoryView = APP.BB.BaseView.extend({

		events: {},

		initialize: function (data) { // parentView:view, pageIndex:number

			var view = this,
				story = window.APP.lang.get('story'),
				text = story.list[data.storyNumber],
				imgPathPrefix = story.imgPathPrefix,
				pages = text.split('_!!_'),
				reDetectImg = /\w+\.png$/;

			pages = _.map(pages, function (page) {
				return _.map(page.split('_!_'), function (part) {
					return reDetectImg.test(part) ? {type: 'img', src: imgPathPrefix + part} : {type: 'text', src: part};
				});
			});

			view.$el = $(view.tmpl.story({pages: pages}));

			view.extendFromObj(data);

			view.proto.initialize.apply(view, arguments);
			view.render();

		},

		render: function () {

			var view = this,
				parentView = view.get('parentView');

			parentView.$el.append(view.$el);

		}

	});

}(window));