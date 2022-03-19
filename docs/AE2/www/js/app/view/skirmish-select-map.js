/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global console, alert, window, document, setTimeout, clearTimeout */
	/*global APP, $, Backbone*/

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.SkirmishSelectMapView = APP.BB.BaseView.extend({

		events: {
			'click .js-map-preview': 'showMapPreview'
		},

		squareSize: {
			max: 24
		},

		initialize: function (data) {

			data = data || {};

			var view = this;

			win.APP.map.db.getMapsInfo(data).then(function (mapsData) {

				var mapsInfo = [],
					language = view.info.get('language');

				_.each(mapsData, function (item, key) {
					item.jsKey = key;
					mapsInfo.push(item);
				});

				mapsInfo = mapsInfo.sort(function (a, b) {

					var aName = a['name-' + language] || a.name,
						bName = b['name-' + language] || b.name;

					return ((a.maxPlayers + aName) > (b.maxPlayers + bName)) ? 1 : -1;

				});

				if (data.type === 'userMap') {

					view.$el = $(view.tmpl.skirmishSelectMap({
						mapsInfo: mapsInfo,
						urlPrefix: 'user-map-setup-map'
					}));

					view.set('map-type', 'userMap');

				} else { // skirmish

					view.$el = $(view.tmpl.skirmishSelectMap({
						mapsInfo: mapsInfo,
						urlPrefix: 'skirmish-setup-map'
					}));

					view.set('map-type', 'skirmish');

				}

				view.proto.initialize.apply(view, arguments);

				view.render();

			});


		},

		showMapPreview: function (e) {

			var view = this,
				$el = view.$el,
				dbMaster = win.APP.map.db,
				$this = $(e.currentTarget),
				jsMapKey = $this.attr('data-js-map-key'),
				mapType = $this.attr('data-map-type'),
				$previewWrapper = $el.find('[data-preview-wrapper-for="' + jsMapKey + '"]'),
				$previewImage = $el.find('[data-preview-image-for="' + jsMapKey + '"]');

			if ($previewWrapper.hasClass('hidden')) {
				$previewWrapper.removeClass('hidden');

				if ( $previewWrapper.find('.map-preview-canvas').length ) {
					return;
				}

				if ( view.get('map-type') === 'skirmish' ) {

					$previewImage.html('<img class="map-preview-canvas" src="map/' + $this.attr('data-js-map-key') + '_preview.png" />')

				} else {

					dbMaster.getMap({
						type: mapType,
						jsMapKey: jsMapKey
					}).then(function (data) {
						$previewImage.append(view.getPreviewFromData(data));
					});

				}

			} else {
				$previewWrapper.addClass('hidden');
			}

		},

		getPreviewFromData: function (data) {

			var view = this,
				canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				squareSize = view.squareSize.max,
				squareSizeX2,
				terrains = data.terrain,
				mapWidth = data.size.width,
				mapHeight = data.size.height,
				mapTilesPreview = win.APP.mapTilesPreview,
				getXYFromStringXY = view.util.getXYFromStringXY,
				buildings = data.buildings,
				allColors = win.APP.map.allColors,
				noMansBuildingsList = win.APP.building.noMansBuildingsList,
				maxCanvasSize = win.APP.map.maxCanvasSize / 4;

			while ( mapWidth * mapHeight * squareSize * squareSize * 4 >= maxCanvasSize ) {
				squareSize -= 4;
			}

			squareSizeX2 = squareSize * 2;

			canvas.width = mapWidth * squareSizeX2;
			canvas.height = mapHeight * squareSizeX2;

			// reduce blur for ios devices
			ctx.webkitImageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false; // future

			// draw main tiles
			_.each(terrains, function (value, xy) {
				xy = getXYFromStringXY(xy);
				ctx.drawImage(mapTilesPreview[value].img, xy.x * squareSizeX2, xy.y * squareSizeX2, squareSizeX2, squareSizeX2);
			});

			_.each(buildings, function (building) {

				var type = building.type,
					xy = {
						x: building.x,
						y: building.y
					},
					color = building.hasOwnProperty('ownerId') ? allColors[building.ownerId] : 'gray',
					state = building.state;

				if (state === 'destroyed') { // destroyed farm
					ctx.drawImage(mapTilesPreview[type + '-' + state].img, xy.x * squareSizeX2, xy.y * squareSizeX2, squareSizeX2, squareSizeX2);
					return;
				}

				if ( _.contains(noMansBuildingsList, type) ) { // well or temple
					ctx.drawImage(mapTilesPreview[type].img, xy.x * squareSizeX2, xy.y * squareSizeX2, squareSizeX2, squareSizeX2);
					return;
				}

				if (type === 'castle') {
					ctx.drawImage(mapTilesPreview[type + '-' + color].img, xy.x * squareSizeX2, (xy.y - 1) * squareSizeX2, squareSizeX2, squareSizeX2 * 2);
				} else {
					ctx.drawImage(mapTilesPreview[type + '-' + color].img, xy.x * squareSizeX2, xy.y * squareSizeX2, squareSizeX2, squareSizeX2);
				}

			});

			canvas.className = 'map-preview-canvas';

			return canvas;


		}

	});

}(window));