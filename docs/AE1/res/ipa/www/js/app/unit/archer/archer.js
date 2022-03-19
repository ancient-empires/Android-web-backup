(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var archer = APP.units.Archer = function(data) {

		this.baseInit(data);

	};

	archer.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));