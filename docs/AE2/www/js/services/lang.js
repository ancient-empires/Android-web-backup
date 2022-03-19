/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */
	/*global APP */

	win.APP = win.APP || {};

	var lang = {

		attr: {},

		set: function (lang) {
			this.attr = APP.languages[lang];
		},

		get: function (key) {
			return key ? this.attr[key] : this.attr;
		}

	};

	// default language
	lang.set( APP.info.get('language') );

	APP.lang = lang;

}(window));