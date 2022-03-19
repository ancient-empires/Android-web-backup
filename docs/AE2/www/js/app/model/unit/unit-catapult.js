/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global console, alert, window, document */
	/*global _ */

	win.APP.BB.Unit.CatapultModel = win.APP.BB.Unit.BaseUnitModel.extend({

		defaults: win.APP.unitMaster.list.catapult,

		/* overwrite
		 * base-unit.js canStrikeBack
		 * */
		canStrikeBack: function () {
			return false;
		},

		/* overwrite
		 * base-unit.js getUnitsUnderAttack
		 * */
		getUnitsUnderAttack: function () {

			var unit = this,
				unitTeamNumber = unit.get('teamNumber'),
				model = unit.get('model'),
				buildings = model.get('buildings'),
				proto = win.APP.BB.Unit.BaseUnitModel.prototype,
				getUnitsUnderAttack = proto.getUnitsUnderAttack,

				underAttackXYs,
				availableAttackMap;

			underAttackXYs = getUnitsUnderAttack.call(this);

			underAttackXYs = unit.filterExtraXYs(underAttackXYs);

			availableAttackMap = unit.filterExtraXYs(unit.getAvailableAttackMap());

			_.each(buildings, function (building) {

				var type = building.type,
					xy = {
						x: building.x,
						y: building.y
					},
					state = building.state,
					availableStates = win.APP.building.list[type].availableStates,
					unitOnXY = model.getUnitByXY(xy);

				if ( !_.find(availableAttackMap, xy) ) { // do not add extra buildings
					return;
				}

				if ( !_.contains(availableStates, 'destroyed') ) { // do not add without 'destroyed' state
					return;
				}

				if ( state === 'destroyed' ) { // do not destroy twice
					return;
				}

				if ( unitTeamNumber === building.teamNumber ) { // do not destroy team building
					return;
				}

				if ( null === building.teamNumber ) { // do not destroy no man's building
					return;
				}

				if ( _.find(underAttackXYs, xy) ) { // do not add the same XY twice
					return;
				}

				if ( unitOnXY && unitOnXY.get('teamNumber') === unit.get('teamNumber') ) { // do not add xy if team unit on building
					return;
				}

				underAttackXYs.push(xy);

			});

			return underAttackXYs;

		},

		/* overwrite
		 * base-unit.js bindEventListener
		 * */
		bindEventListener: function () {

			var unit = this,
				proto = win.APP.BB.Unit.BaseUnitModel.prototype,
				bindEventListener = proto.bindEventListener;

			bindEventListener.call(unit);

			unit.on('change:didMove', function (e, didMove) {
				this.set('isActive', !didMove);
			});

		},

		/* overwrite
		 * base-unit.js bindEventListener
		 * */
		getAvailablePathWithTeamUnit: function () {

			var unit = this,
				unitTeamNumber = unit.get('teamNumber'),
				model = unit.get('model'),
				buildings = model.get('buildings'),
				proto = win.APP.BB.Unit.BaseUnitModel.prototype,
				availablePathWithTeamUnit,
				getAvailablePathWithTeamUnit = proto.getAvailablePathWithTeamUnit;

			availablePathWithTeamUnit = getAvailablePathWithTeamUnit.call(unit);

			availablePathWithTeamUnit = _.filter(availablePathWithTeamUnit, function (xy) {

				var building = _.find(buildings, xy),
					type,
					state,
					availableStates;

				if ( !building ) {
					return true;
				}

				type = building.type;
				state = building.state;
				availableStates = win.APP.building.list[type].availableStates;

				if ( !_.contains(availableStates, 'destroyed') ) {
					return true;
				}

				if ( state === 'destroyed' ) { // do not destroy twice
					return true;
				}

				if ( building.teamNumber === unitTeamNumber ) {
					return true;
				}

				//if ( null === building.teamNumber ) {
				//	return true;
				//}
				//return false;
				return null === building.teamNumber;

			});

			return availablePathWithTeamUnit;

		},

		filterExtraXYs: function (arr) {
			
			var unit = this,
				x = unit.get('x'),
				y = unit.get('y'),
				removedXYs = [
					{x: x, y: y - 1}, // 2
					{x: x - 1, y: y}, // 4
					{x: x + 1, y: y}, // 6
					{x: x, y: y + 1}  // 8
				];

			return _.filter(arr, function (xy) {
				return !_.find(removedXYs, xy);
			});

		},

		getAvailableAttackMapWithPath: function () {

			var unit = this,
				x = unit.get('x'),
				y = unit.get('y'),
				availableAttackMap = unit.getAvailableAttackMapFromXy({
					x: x,
					y: y
				});

			return unit.filterExtraXYs(availableAttackMap);

		}

	});

}(window));