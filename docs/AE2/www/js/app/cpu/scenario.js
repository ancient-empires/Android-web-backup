/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global window */
	/*global */

	function Scenario (json) { // x, y, action

		var sc = this;
		sc.attr = {};
		sc.extend(json);

	}

	Scenario.prototype = {

		get: function (key) {
			return this.attr[key];
		},

		set: function (key, value) {
			this.attr[key] = value;
			return this;
		},

		changeBy: function (key, delta) {
			return this.set(key, this.get(key) + delta);
		},

		extend: function (json) {
			_.extend(this.attr, json);
			return this;
		}

	};




	win.APP.Scenario = Scenario;

}(window));