(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global APP, util */

	var proto;

	var wizard = APP.units.Wizard = function(data) {

		this.baseInit(data);

	};

	wizard.prototype = new APP.units.BaseUnit();

	proto = {
		getAvailablePath: wizard.prototype.getAvailablePath
	};

	wizard.prototype.getAvailablePath = function() {

		var path = proto.getAvailablePath.apply(this, arguments),
			controller = arguments[0],
			graves = controller.unitsRIP,
			fixedPath = [];

		path.forEach(function(step){

			var key, grave, graveX, graveY, pathX, pathY, needAddToFixedPath = true;

			pathX = step.x;
			pathY = step.y;

			for (key in graves) {
				if (graves.hasOwnProperty(key)) {
					grave = graves[key];
					graveX = grave.x;
					graveY = grave.y;

					if (graveX === pathX && graveY === pathY) {
						needAddToFixedPath = false;
					}

				}
			}

			if (needAddToFixedPath) {
				fixedPath.push(step);
			}

		});

		return fixedPath;

	};


}(window, document, document.documentElement));