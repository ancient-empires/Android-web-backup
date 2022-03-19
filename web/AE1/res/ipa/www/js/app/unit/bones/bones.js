(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var bones = APP.units.Bones = function(data) {

		this.baseInit(data);

	};

	bones.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));