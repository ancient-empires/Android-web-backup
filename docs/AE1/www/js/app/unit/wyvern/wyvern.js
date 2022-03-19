(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var wyvern = APP.units.Wyvern = function(data) {

		this.baseInit(data);

	};

	wyvern.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));