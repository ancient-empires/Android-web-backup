(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP */

	win.APP = win.APP || {};

	APP.CreditsView = APP.BaseView.extend({

		templates: ['credits'],

		events: {

		},

		init: function() {

			this.$el = $(this.tmpl.credits());

			this.$wrapper = $('.js-wrapper');

			this.$wrapper.html('');

			this.$wrapper.append(this.$el);

		}

	});

}(window));