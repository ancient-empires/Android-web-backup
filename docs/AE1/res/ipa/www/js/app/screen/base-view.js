(function (win) {

	"use strict";
	/*global window, Backbone, $, templateMaster, setTimeout, APP, history */

	win.APP = win.APP || {};

	APP.BaseView = Backbone.View.extend({

		templates: [],
		tmpl: {},
		events: {},
		initialize: function(data) {

			data = data || {};

			var events = this.events,
				key, event, selector, arr;

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					this[key] = data[key];
				}
			}

			this.templates.forEach(function(name){
				this.tmpl[name] = templateMaster.tmplFn[name];
			}, this);

			if (this.init) {
				this.init(data);
			}

			for (key in events) {
				if (events.hasOwnProperty(key)) {
					arr = key.replace(/,/gi, ' ').replace(/\s+/gi, ' ').match(/[\S]+/g);
					event = arr.shift();
					selector = arr.join(', ');
					this.$el.find(selector).on(event, this[events[key]].bind(this));
				}
			}

			this.bindBackButton();

			this.disableScrollNodes();

			this.bindStopClick();

			this.bindShowHideBlock();

			this.labelEvent();

			win.blockFix();

			win.blockFixWithScroll();

		},

		labelEvent: function () {
			this.$el.find('[data-tag="label"]').on('click', function () {
				var input = this.querySelector('input'),
					checked = input.checked;

				if (checked && input.type !== "checkbox") {
					return;
				}

				input.checked = !checked;

				$(input).on('change');

			});
		},

		bindBackButton: function() {
			this.$el.find('.js-back').on('click', function(){
				if (Backbone.history.fragment) {
					history.back();
				}
			});
		},

		disableScrollNodes: function () {

			function noScroll(e) {
				e.preventDefault();
				e.stopPropagation();
			}

			this.$el.find('.js-no-scroll').each(function () {
				this.addEventListener('touchmove', noScroll, false);
			});

			if (this.$el.hasClass('js-no-scroll')) {
				this.$el[0].addEventListener('touchmove', noScroll, false);
			}


		},

		bindStopClick: function () {

			function stopEvent(e) {
				e.stopPropagation();
				e.preventDefault();
			}

			this.$el.find('.js-stop-click').each(function () {
					this.addEventListener('touchstart', stopEvent, false);
					this.addEventListener('mousedown', stopEvent, false);
					this.addEventListener('touchend', stopEvent, false);
					this.addEventListener('mouseup', stopEvent, false);
					this.addEventListener('click', stopEvent, false);
				});


		},

		bindShowHideBlock: function () {

			this.$el.find('[data-hide-show]').each(function () {

				$(this).on('click', function () {

					var selector = this.dataset.hideShow;
					$('.js-wrapper [data-block="' + selector + '"]').addClass('hidden');
					$('.js-wrapper [data-show="' + selector + '"] .js-hidden-data-state').html('[+]');

				});

			});

			this.$el.find('[data-show]').each(function () {

				$(this).on('click', function () {

					var selector = this.dataset.show,
						dataStateNode = this.querySelector('.js-hidden-data-state'),
						$block = $(this.parentNode.querySelector('[data-block="' + selector + '"]')),
						needShow = $block.hasClass('hidden');

					$('.js-wrapper [data-show]').each(function () {
						$(this.parentNode.querySelector('[data-block="' + this.dataset.show + '"]')).addClass('hidden');
						this.querySelector('.js-hidden-data-state').innerHTML = '[+]';
					});

					if ( needShow ) {
						$block.removeClass('hidden');
						$block.addClass('not-active');
						dataStateNode.innerHTML = '[-]';
						setTimeout(function () {
							$('.not-active').removeClass('not-active');
						}, 350);
					}

				});

			});

		},
		showNotification: function (data) {

			APP.notificationView.show(data);

		}

	});

}(window));