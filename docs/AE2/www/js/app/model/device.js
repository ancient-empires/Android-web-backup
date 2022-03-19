/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global console, alert, window, document */
	/*global Backbone, $ */

	var Device = Backbone.Model.extend({

		initialize: function(){

			this.bindEventListeners();

		},
		bindEventListeners: function () {

			$(win).on('resize', $.proxy( this, 'onResize' ) );

		},
		onResize: function () {

			this.trigger('resize');

		}


	});

	win.APP.device = new Device();

}(window));