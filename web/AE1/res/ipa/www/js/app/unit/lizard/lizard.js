(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var lizard = APP.units.Lizard = function(data) {

		this.baseInit(data);

	};

	lizard.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));