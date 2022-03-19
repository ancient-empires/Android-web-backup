(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var wisp = APP.units.Wisp = function(data) {

		this.baseInit(data);

	};

	wisp.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));