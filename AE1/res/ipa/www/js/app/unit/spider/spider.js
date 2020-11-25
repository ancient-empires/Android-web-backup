(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var spider = APP.units.Spider = function(data) {

		this.baseInit(data);

	};

	spider.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));