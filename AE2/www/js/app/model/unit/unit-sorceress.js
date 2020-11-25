(function (win) {

	"use strict";
	/*global console, alert, window, document */
	/*global */

	var proto = win.APP.BB.Unit.BaseUnitModel.prototype;

	win.APP.BB.Unit.SorceressModel =  win.APP.BB.Unit.BaseUnitModel.extend({

		defaults: win.APP.unitMaster.list.sorceress,

		getAvailablePathWithTeamUnit: function () {

			var unit = this,
				model = unit.get('model'),
				graves = model.get('graves'),
				path,
				endPath = [];

			path = proto.getAvailablePathWithTeamUnit.apply(unit, arguments);

			_.each(path, function (xy) {
				return _.find(graves, xy) || endPath.push(xy);
			});

			return endPath;

		}

	});

}(window));