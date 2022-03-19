(function (win, doc, docElem) {

	"use strict";
	/*global window, document */
	/*global util, APP, setTimeout */

	win.util = {

		forceReDraw: function (el) {

			el = el || doc.body;

			if ( !el.length ) {
				el = [el];
			}

			var temp;

			el.forEach(function (item) {
				item.style.display = 'none';
				temp = item.offsetHeight; // no need to store this anywhere, the reference is enough
			});

			el.forEach(function (item) {
				setTimeout(function () {
					item.style.display = '';
				}, 0);
			});

			return temp;

		},

		setWrapperStyle: function(node) {

			var screenSize = docElem.clientWidth * docElem.clientHeight,
				fontSize = Math.round(16 * Math.pow(screenSize / 181760, 0.5) );

			node.css({
				'font-size': fontSize + 'px'
			});

		},

		extend: function (main, plused) {
			var key;
			for (key in plused) {
				if (plused.hasOwnProperty(key)) {
					main[key] = plused[key];
				}
			}

			return main;
		},
		capitalise: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		},
		objForEach: function(obj, func, context) {

			var key;

			context = context || obj;

			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					func.call(context, obj[key], key);
				}
			}

		},
		objToArray: function (obj) {
			var arr = [],
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					arr.push({
						key: key,
						value: obj[key]
					});
				}
			}

			return arr;

		},
		findBy: function (list, key, value) {

			var result = null;

			list.every(function (item, index) {

				if (item[key] === value) {
					result = {
						item: item,
						index: index
					};
					return false; // stop loop
				}

				return true; // continue loop

			});

			return result;

		},
		createCopy: function (obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		isEqualsObject: function (obj1, obj2) {
			return JSON.stringify(obj1) === JSON.stringify(obj2);
		},
		fromTo: function (func, start, end) {
			if (end === undefined) {
				end = start;
				start = 0;
			}

			var i;
			for (i = start; i < end; i += 1) {
				func(i);
			}

		},
		has: function(arr, item) {
			return arr.indexOf(item) !== -1;
		},
		xyUnitsMap: function(units) {
			var data = {},
				key, unit;

			for (key in units) {
				if (units.hasOwnProperty(key)) {
					unit = units[key];
					data['x' + unit.x + 'y' + unit.y] = unit;
				}
			}

			return data;

		},
		removeFromArray: function(arr, item) {
			arr.splice(arr.indexOf(item), 1);
			return arr;
		},
		getPathLength: function(p1, p2) {

			return Math.pow(
				Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
				0.5);

		},
		round: function (number, q) {
			q = q && Math.pow(10, q);
			return q ? Math.round(number * q) / q : Math.round(number);
		},
		clearTimeouts: function () {
			var end = setTimeout(';'),
				i;

			for (i = end - 10000; i < end; i += 1) {
				clearTimeout(i);
			}

		}

	};

	function PathFinder(data) {
		util.extend(this, data); // get from data - map, x, y, mov, relativeTypeSpace;
		this.availablePath = [];
		this.donePathPoints = [];
	}

	util.PathFinder = PathFinder;

	function PathFinderPoint(data) {
		util.extend(this, data);
		this.run();
	}

	PathFinderPoint.prototype = {

		run: function () {

			var x = this.x,
				y = this.y;

			// this is in donePoints
			if (this.parent.isInDonePoints(x, y, this.mov)) {
				return;
			}

			this.parent.addToDonePoints(x, y, this.mov);

			// add current coordinates to parent
			this.parent.addCoordinatesToAvailablePath({x: x, y: y});

			this.tryGoToSquare({x: x + 1, y: y});
			this.tryGoToSquare({x: x - 1, y: y});
			this.tryGoToSquare({x: x, y: y + 1});
			this.tryGoToSquare({x: x, y: y - 1});

		},

		tryGoToSquare: function (coordinates) {

			var x = coordinates.x,
				y = coordinates.y,
				square,
				pathResistance = 1,
				point,
				unitType = this.unit.runType;

			if (this.parent.relativeTypeSpace) {
				// get square bu coordinates
				square = APP.map.getSquareByXY(this.parent.map, x, y);
				if (square) {

					switch (unitType) {
						case 'fly':
							pathResistance = 1;
							break;

						case 'flow':

							if (square === 'water') {
								pathResistance = APP.map.water.specialPathResistance;
							}

							break;
						default :
							pathResistance = APP.map[square].pathResistance;

					}



				}
			}

			if (this.mov >= pathResistance) {
				point = new PathFinderPoint({
					parent: this.parent,
					mov: this.mov - pathResistance,
					x: x,
					y: y,
					unit: this.unit
				});

			}


		}

	};

	PathFinder.prototype = {

		getAvailablePath: function (data) {

			var point = new PathFinderPoint({
				parent: this,
				mov: this.mov,
				x: this.x,
				y: this.y,
				unit: data.unit
			});

			return this.availablePath;

		},

		addCoordinatesToAvailablePath: function (data) {

			var isInPoints = false,
				x = data.x,
				y = data.y;

			this.availablePath.every(function (point) {

				if (point.x === x && point.y === y) {
					isInPoints = true;
					return false;
				}

				return true;

			});

			if (!isInPoints) {
				this.availablePath.push(data);
			}


		},

		isInDonePoints: function (x, y, mov) {

			var isInDonePoints = false;

			this.donePathPoints.every(function (point) {

				if (point.x === x && point.y === y && mov <= point.mov) {
					isInDonePoints = true;
					return false;
				}

				return true;

			});

			return isInDonePoints;

		},

		addToDonePoints: function (x, y, mov) {

			if (this.isInDonePoints(x, y, mov)) {
				return;
			}

			this.donePathPoints.push({ x: x, y: y, mov: mov });
		}

	};

}(window, document, document.documentElement));