(function (win) {

	"use strict";
	/*global console, alert, window, document */
	/*global */

	win.APP.BB.Unit.CrystalModel =  win.APP.BB.Unit.BaseUnitModel.extend({

		defaults: win.APP.unitMaster.list.crystal,

		canStrikeBack: function () {
			return false;
		}

	});

}(window));