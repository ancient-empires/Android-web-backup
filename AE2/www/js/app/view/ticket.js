/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global console, alert, window, document, setTimeout */
	/*global APP, $, Backbone*/

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.TicketView = APP.BB.BaseView.extend({

		events: {

		},

		selectors: {

		},

		initialize: function(data) {

			var view = this,
				timeoutId;

			view.extendFromObj(data); // popupName, parentView, popupData(objToView)

			view.$el = $(view.tmpl['ticket-wrapper'](data.popupData));

			if (data.cssClass) {
				view.$el.addClass(data.cssClass);
			}

			view.proto.initialize.apply(this, arguments);

			view.bindEventListeners();

			view.render();

			view.showInAnimation();

			timeoutId = setTimeout(function () {
				view.hide();
			}, view.info.actionTime() * 6);

			view.set('timeoutId', timeoutId);

		},

		bindEventListeners: function () {
			var view = this;
			view.$el.on('click', $.proxy(view, 'hide' ));
		},

		unbindEventListeners: function () {
			var view = this;
			view.$el.off('click', view.hide );
			clearTimeout(view.get('timeoutId'));
		},

		render: function () {

			var view = this,
				playSound = view.get('playSound');

			if (playSound) {
				win.APP.soundMaster.play(playSound);
			}

			view.$wrapper.append(view.$el);

		},

		hide: function () {

			var view = this;

			view.showOutAnimation().then(function () {
				view.proto.hide.call(view);
				view.get('deferred').resolve();
			});

		},

		showInAnimation: function () {

			var view = this;
			setTimeout(function () { // show animation
				view.$el.addClass('show-in');
			}, 50);

		},

		showOutAnimation: function () {

			var view = this,
				$el = view.$el,
				deferred = $.Deferred(),
				transitionEnd = view.info.get('transitionEnd', true);

			$el.one(transitionEnd, function () {
				deferred.resolve();
			}); // work only one time

			$el.addClass('show-out');

			return deferred.promise();

		}

	});

}(window));