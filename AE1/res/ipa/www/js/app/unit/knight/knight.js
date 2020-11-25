(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var knight = APP.units.Knight = function(data) {

		this.baseInit(data);

	};

	knight.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));