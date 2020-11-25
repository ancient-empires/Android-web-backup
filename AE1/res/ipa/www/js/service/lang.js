(function (win) {

	"use strict";
	/*global window */
	/*global info */

	win.lang = {
		push: function(lang) {
			this.name = lang;
			var obj = win.langs[lang],
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					this[key] = obj[key];
				}
			}
		}
	};

	// default language
	win.lang.push(win.info.lang);

}(window));