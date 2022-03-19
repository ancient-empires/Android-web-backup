(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP */

	win.APP = win.APP || {};

	APP.InstructionView = APP.BaseView.extend({

		templates: ['instruction'],

		events: {

		},

		init: function() {

			this.$el = $(this.tmpl.instruction());

			this.$wrapper = $('.js-wrapper');

			this.$wrapper.html('');

			this.$wrapper.append(this.$el);

		}

	});

}(window));