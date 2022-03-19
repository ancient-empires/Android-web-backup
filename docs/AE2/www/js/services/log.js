/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window, document, console */
	/*global */

	win.logger = {
		on: function () {
			console.log('Logger is Enabled');
			this.isEnable = true;
		},
		off: function () {
			console.log('Logger is Disabled');
			this.isEnable = false;
		},
		isEnable: false,
		log: function () {
			return this.isEnable && console.log.apply(console, arguments);
		}
	};

	function log() {
		return logger.log.apply(logger, arguments);
	}

	win.log = log;

}(window));