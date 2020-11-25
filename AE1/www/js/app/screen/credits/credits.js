(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP */

	win.APP = win.APP || {};

	APP.CreditsView = APP.BaseView.extend({

		templates: ['credits'],

		events: {
			'click .js-external-link': 'toExternalLink'
		},

		init: function() {

			this.$el = $(this.tmpl.credits());

			this.$wrapper = $('.js-wrapper');

			this.$wrapper.html('');

			this.$wrapper.append(this.$el);

			setTimeout(function () {

				var node = win.document.querySelector('.js-do-not-touch');

				if (!node) {
					return;
				}

				node.parentNode.removeChild(node);

			}, 500);

		},

		toExternalLink: function(e) {

			e.preventDefault();
			e.stopPropagation();

			var $this = $(e.target),
				url = $this.attr('href');

			win.open(url);

		}


	});

}(window));