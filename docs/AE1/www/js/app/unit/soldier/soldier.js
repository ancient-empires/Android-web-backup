(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var soldier = APP.units.Soldier = function(data) {

		this.baseInit(data);

	};

	soldier.prototype = new APP.units.BaseUnit();

}(window, document, document.documentElement));