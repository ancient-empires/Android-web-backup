(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var proto;
	
	var	catapult = APP.units.Catapult = function(data) {

		this.baseInit(data);

	};

	catapult.prototype = new APP.units.BaseUnit();

	proto = {
		moveTo: catapult.prototype.moveTo,
		findUnitsUnderAttack: catapult.prototype.findUnitsUnderAttack
	};

	catapult.prototype.moveTo = function() {
		proto.moveTo.apply(this, arguments);
		this.setEndTurn();
	};

	catapult.prototype.findUnitsUnderAttack = function() {

		var units = proto.findUnitsUnderAttack.apply(this, arguments) || [],
			x = this.x,
			y = this.y,
			filteredUnits;

		filteredUnits = units.filter(function(unit){
			var uX = unit.x,
				uY = unit.y;
			return !( (uX + 1 === x && uY === y) || (uX - 1 === x && uY === y) || (uX === x && uY + 1 === y) || (uX === x && uY - 1 === y) );
		});

		return filteredUnits;

	};


}(window, document, document.documentElement));