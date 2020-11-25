/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global */

	win.APP = win.APP || {};

	win.APP.util = {
		setHTMLStyle: function() {

			var util = this,
				screenSize = docElem.clientWidth * docElem.clientHeight,
				fontSize = Math.round( 16 * Math.pow(screenSize / 153600, 0.5) ); // 153600 = 320 * 480

			fontSize = util.getBetween(16, fontSize, 24);

			fontSize = Math.round(fontSize / 2) * 2;

			docElem.style.fontSize = fontSize + 'px';

		},
		assortArray: function (arr) {
			return arr.sort(function () {
				return 0.5 - Math.random();
			});
		},
		arrayRemoveByValue: function (arr, value) {
			var index = arr.indexOf(value);
			if (index !== -1) {
				arr.splice(index, 1);
			}
			return arr;
		},
		getBetween: function (min, current, max) {
			current = Math.min(current, max);
			current = Math.max(current, min);
			return current;
		},
		getPathSize: function (xy1, xy2) {
			return Math.pow( Math.pow(xy1.x - xy2.x, 2) + Math.pow(xy1.y - xy2.y, 2) , 0.5);
		}

	};

}(window, document, document.documentElement));