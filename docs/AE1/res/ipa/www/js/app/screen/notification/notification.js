(function (win) {

	"use strict";
	/*global window, document, setTimeout, clearTimeout */
	/*global bingo, $, info, APP, Backbone */

	/*
	 * setting
	 * 1 - music off/on
	 * 2 - ask for switch turn
	 * 3 - animation speed -                 slow - 1 2 [3] 4 5 - fast
	 *
	 *
	 * */

	/*

	 [*] music
	 [*] end turn confirm

	 animation speed
	 slow - 1 2 [3] 4 5 - fast

	 */


	win.APP = win.APP || {};

	APP.NotificationView = APP.BaseView.extend({

		templates: ['notification-wrapper', 'notification-alert-wrapper', 'n-banner', 'n-turn'],

		showTimeout: 7e3,

		events: {

		},

		init: function() {


			this.$wrapper = $('.js-wrapper');

			//this.$wrapper.html('');
			//
			//this.setSettingsState();
			//

		},

		show: function (data) { // template name, data for template, from left||right

			//debugger

			if (data instanceof String) {
				data = {
					text: data
				};
			}

			data.from = data.from || 'left';

			data.tmpl = data.tmpl || 'n-banner';

			data.type = data.type || 'notification';

			clearTimeout(this.showTimeoutId);

			this.showTimeoutId = setTimeout(this.hideExtraWindows, data.type === 'alert' ? this.showTimeout * 3 : this.showTimeout);

			this.hideExtraWindows();

			switch ( data.type ) {

				case 'notification' :
					this.$el = $(this.tmpl['notification-wrapper'](data));
					break;

				case 'alert' :
					this.$el = $(this.tmpl['notification-alert-wrapper'](data));
					break;

			}

			if (data.onHide) {
				this.$el.on('hide', function () {
					if (this.getAttribute('data-is-done')) {
						return;
					}
					this.setAttribute('data-is-done', 1);
					data.onHide();
				});
			}

			var newNode = $(this.tmpl[data.tmpl](data));

			newNode.on('click', this.hideExtraWindows);

			this.$el.find('.js-notification-container').append(newNode);

			this.$wrapper.append(this.$el);

			this.$el.addClass('n-anim-show-from-' + data.from);

			this.$el.on('click', function () {
				if (Backbone.history.fragment === 'store') {
					APP.NotificationView.prototype.hideExtraWindows();
				}
			});

			this.disableScrollNodes();

		},
		hideExtraWindows: function (e) {

			var $node = e ? $(e.currentTarget.parentNode.parentNode) : $('.js-wrapper').find('.js-notification-wrapper');

			if (e && !$node.hasClass('js-notification-wrapper')) {
				$node = $(e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode);
			}

			if ( !$node.length ) {
				return;
			}

			$node.addClass('n-anim-hide');

			$node.forEach(function (node) {
				$(node).on('hide');
			});

			//setTimeout($node.remove.bind($node), 600); // see notification.css
			setTimeout(function () {
				$node.remove();
			}, 600); // see notification.css

		},
		hideNotification: function () {
			this.hideExtraWindows(false);
		}

	});

}(window));