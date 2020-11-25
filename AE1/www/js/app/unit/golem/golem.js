(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var golem = APP.units.Golem = function(data) {

		this.baseInit(data);

	};

	golem.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));