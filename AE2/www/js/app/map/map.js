/*jslint white: true, nomen: true */
(function (win, doc) {

	'use strict';
	/*global window, document, openDatabase */
	/*global $, _ */

	win.APP.map = {
		mapPackVersion: 4,
		squareSize: {
			min: 24,
			max: 96, // 192
			default: 48 // 24 * 2
		},
		//maxCanvasSize: 3145728 - 1, // 2048 * 768 * 2 - 1 - default version
		maxCanvasSize: 1536 * 768 * 2, // 1536 * 768 * 2 - 1
		scaleImage: function (img, scale) {

			var imgWidth = img.width,
				imgHeight = img.height,
				srcCanvas,
				srcCtx,
				srcData,
				dstCanvas,
				dstCtx,
				offset,
				x, y, r, g, b, a;

			srcCanvas = doc.createElement('canvas');
			srcCanvas.width = imgWidth;
			srcCanvas.height = imgHeight;

			srcCtx = srcCanvas.getContext('2d');
			srcCtx.drawImage(img, 0, 0);
			srcData = srcCtx.getImageData(0, 0, img.width, img.height).data;

			dstCanvas = doc.createElement('canvas');
			dstCanvas.width = imgWidth * scale;
			dstCanvas.height = imgHeight * scale;
			dstCtx = dstCanvas.getContext('2d');

			offset = 0;
			for (y = 0; y < imgHeight; y += 1) {
				for (x = 0; x < imgWidth; x += 1) {
					r = srcData[offset];
					offset += 1;
					g = srcData[offset];
					offset += 1;
					b = srcData[offset];
					offset += 1;
					a = srcData[offset] / 100;
					offset += 1;
					dstCtx.fillStyle = 'rgba(' + [r, g, b, a].join(',') + ')';
					dstCtx.fillRect(x * scale, y * scale, scale, scale);
				}
			}

			return dstCanvas.toDataURL();

		},
		allColors: ['blue', 'red', 'green', 'black', 'gray'],
		playerColors: ['blue', 'red', 'green', 'black'],
		playerTypes: ['player', 'cpu', 'none'],
		money: [500, 750, 1000, 1500, 2000, 5000],
		unitsLimits: [10, 15, 20, 25],
		terrainTypes: ['bridge-1', 'bridge-2', 'forest-1', 'forest-2', 'hill-1', 'road-1', 'stone-1', 'stone-2', 'terra-1', 'terra-2', 'terra-3', 'terra-4', 'terra-5', 'water-1', 'water-2', 'water-3'],
		progressLength: 0,
		progress: 0,
		getTypeByTileName: function (tileName) {
			return tileName.replace(/\-\d+$/, '');
		},

		prepareTiles: function (tiles) {

			var deferred = $.Deferred(),
				promise = deferred.promise(),
				mainDeferred = $.Deferred(),
				map = this;

			function preLoadImage(src, key) {

				var deferred = $.Deferred(),
					img = new Image();

				function onceLoad() {
					this.removeEventListener('load', onceLoad);
					this.removeEventListener('error', onceLoad);

					var base64Scaled = win.APP.map.scaleImage(this, 4);

					tiles[key] = {
						base64: base64Scaled,
						img: img
					};

					img.src = base64Scaled;
					map.recountProgress();
					deferred.resolve();

				}

				img.addEventListener('load', onceLoad, false);
				img.addEventListener('error', onceLoad, false);

				img.src = src;

				return deferred.promise();

			}

			_.each(tiles, function (src, key) {

				promise = promise.then(function () {
					return preLoadImage(src, key);
				});

			});

			promise.then(function () {
				mainDeferred.resolve();
			});

			deferred.resolve();

			return mainDeferred.promise();

		},

		preCacheImages: function () {

			var map = this,
				deferred = $.Deferred(),
				promise = deferred.promise(),
				mainDeferred = $.Deferred();

			// just preload all images
			function preLoadImage(src) {

				var deferred = $.Deferred(),
					img = new Image();

				function onceLoad() {
					this.removeEventListener('load', onceLoad);
					this.removeEventListener('error', onceLoad);
					win.APP.allImagesCache[this.src] = this;
					map.recountProgress();
					deferred.resolve();
				}

				img.addEventListener('load', onceLoad, false);
				img.addEventListener('error', onceLoad, false);

				img.src = src;

				return deferred.promise();

			}

			_.each(win.APP.allImages, function (imgPath) {
				promise = promise.then(function () {
					return preLoadImage(imgPath);
				});
			});

			promise.then(function () {
				mainDeferred.resolve();
			});

			deferred.resolve();

			return mainDeferred.promise();

		},

		recountProgress: function () {

			this.progress += 1;
			doc.querySelector('.js-progress-bar').style.width = Math.round(this.progress / this.progressLength * 100) + '%';

		},

        preloadData: function () {

			this.progressLength = win.APP.allImages.length + _.keys(win.APP.mapTiles).length + _.keys(win.APP.mapTilesPreview).length + _.keys(win.APP.maps).length;

			return this.prepareTiles(win.APP.mapTiles)
				.then(function () {
					return win.APP.map.prepareTiles(win.APP.mapTilesPreview);
				}).then(function () {
                    return win.APP.map.db.init();
				}).then(function () {
                    return win.APP.map.preCacheImages();
				});

		},

		detectDuplicate: function () {

			//TODO: if new map -> window.APP.map.detectDuplicate();

			function getMapNames(map) {
				var mapNames = {};

				_.each(win.APP.info.availableLanguages, function (lang) {
					mapNames[lang] = map['name-' + lang] || map.name;
				});

				return mapNames;

			}

			function getTerrainArray(map) {

				var arr = [],
					terrain = map.terrain,
					width = map.size.width,
					height = map.size.height,
					x, y, lastSymbolIndex, value;

				for (x = 0; x < width; x += 1) {
					for (y = 0; y < height; y += 1) {
						value = terrain['x' + x + 'y' + y];
						lastSymbolIndex = value.lastIndexOf('-');
						arr.push(value.substr(0, lastSymbolIndex));
					}
				}

				return arr;

			}

			// get all skirmish maps
			this.db.getAllMapList().then(function (mapList) {

				_.each(mapList, function (mainMap) {

					var mainMapWidth = mainMap.size.width,
						mainMapHeight = mainMap.size.height,
						mainMapTerrain = getTerrainArray(mainMap),
						mainMapNames = getMapNames(mainMap);

					_.each(mapList, function (map) {

						if (map === mainMap) {
							return;
						}

						var mapNames = getMapNames(map),
							mapTerrain,
							theSameTerrainCount = 0,
							percent;

						 //detect the same names
						_.each(mapNames, function (name, key) {
							if ( name.trim() === mainMapNames[key].trim() ) {
								console.log('!!! - The Same Name -', name);
							}
						});

						if ( mainMapWidth === map.size.width && mainMapHeight === map.size.height ) {
							mapTerrain = getTerrainArray(map);
							_.each(mapTerrain, function (terrainType, index) {
								if (terrainType === mainMapTerrain[index]) {
									theSameTerrainCount += 1;
								}
							});
						}

						percent = Math.round(theSameTerrainCount / mainMapTerrain.length * 100);

						if (percent > 75) {
							console.log(map);
							console.log('%', percent, mapNames.en, '< = >', mainMapNames.en);
						}

					});

				});

			});

		},

		terra: {
			pathResistance: 1,
			defence: 5
		},
		road: {
			pathResistance: 1,
			defence: 0
		},
		bridge: {
			pathResistance: 1,
			defence: 0
		},
		hill: {
			pathResistance: 2,
			defence: 10
		},
		forest: {
			pathResistance: 2,
			defence: 10
		},
		stone: {
			pathResistance: 3,
			defence: 15
		},
		water: {
			pathResistance: 3,
			flowPathResistance: 1,
			defence: 0
		},

		// db
		db: {

			name: 'AE2DB',
			version: '1',
			description: 'AE2 DB',
			size: 1024 * 1024 * 15, // 1024 x 1024 x 20 = 1MB x 15 = 15MB
			db: false, // field for db
			skirmishMaps: 'skirmish',
			missionMaps: 'mission',
			savedGame: 'savedGame',
			userMap: 'userMap',

			init: function () {

				var dbMaster = this,
					deferred = $.Deferred(),
                    db = openDatabase(dbMaster.name, dbMaster.version, dbMaster.description, dbMaster.size),
					map = win.APP.map,
					info = win.APP.info,
					currentMapVersion = map.mapPackVersion,
					previousMapVersion = info.get('mapPackVersion') || 0;

				dbMaster.db = db;

				// create tablet if needed
				db.transaction(function (tx) {

					var missionDeferred = $.Deferred(),
						skirmishDeferred = $.Deferred();

					function createMissionMapTables() {
						tx.executeSql('CREATE TABLE IF NOT EXISTS ' + dbMaster.missionMaps + ' (jsMapKey TEXT, info TEXT, map TEXT)', [], function () {
							missionDeferred.resolve();
						}, function (e) {
							//log(e);
						});
					}

					function createSkirmishMapTables() {
						tx.executeSql('CREATE TABLE IF NOT EXISTS ' + dbMaster.skirmishMaps + ' (jsMapKey TEXT, info TEXT, map TEXT)', [], function () {
							skirmishDeferred.resolve();
						}, function (e) {
							//log(e);
						});
					}

					$.when(missionDeferred, skirmishDeferred).done(function () {
						dbMaster.prepareDefaultMap().then(function () {
                            deferred.resolve();
						});
					});

					// Update maps for next mapPack
					if (currentMapVersion > previousMapVersion) { // remove all maps
						info.set('mapPackVersion', currentMapVersion);
						tx.executeSql('DROP TABLE IF EXISTS ' + dbMaster.skirmishMaps, createSkirmishMapTables, createSkirmishMapTables);
					} else {
						createSkirmishMapTables();
					}

					createMissionMapTables();

					tx.executeSql('CREATE TABLE IF NOT EXISTS ' + dbMaster.savedGame + ' (date TEXT, name TEXT, game TEXT)', [], null, null);
					tx.executeSql('CREATE TABLE IF NOT EXISTS ' + dbMaster.userMap + ' (jsMapKey TEXT, info TEXT, map TEXT)', [], null, null);

				});

                return deferred.promise();

			},

			prepareDefaultMap: function () {

				var maps = win.APP.maps,
					dbMaster = this,
					deferred = $.Deferred(),
					promise = deferred.promise(),
                    mainDeferred = $.Deferred();

				_.each(maps, function (map, jsMapKey) {
					promise = promise.then(function () {
						return dbMaster.prepareMap(map, jsMapKey);
					});
				});

                promise.then(function () {
                    mainDeferred.resolve();
                });

				deferred.resolve();

                return mainDeferred.promise();

			},

            prepareMap: function (map, jsMapKey) {

                var dbMaster = this,
                    db = dbMaster.db,
                    mapObj = win.APP.map,
                    deferred = $.Deferred();

                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM ' + map.type + ' WHERE jsMapKey=?', [jsMapKey], function (tx, results) {
                        if (results.rows.length) {
                            dbMaster.compareMap(results.rows.item(0), map, jsMapKey).then(function () {
                                win.APP.maps[jsMapKey] = null;
                                delete win.APP.maps[jsMapKey];
                                mapObj.recountProgress();
                                deferred.resolve();
                            });
                            return;
                        }
                        dbMaster.insertMap(map, jsMapKey).then(function () {
                            win.APP.maps[jsMapKey] = null;
                            delete win.APP.maps[jsMapKey];
                            mapObj.recountProgress();
                            deferred.resolve();
                        });
                    });
                });

                return deferred.promise();

            },

        	compareMap: function (oldMap, newMap, jsMapKey) {

				var maps = win.APP.maps,
					dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db,
					oldMapData = JSON.parse(oldMap.map),
					newMapVersion = newMap.version || 0,
					oldMapVersion = oldMapData.version || 0,
					savedProperties = ['isOpen', 'isDone', 'isDoneByDifficult_easy', 'isDoneByDifficult_normal', 'isDoneByDifficult_hard'];

				if (oldMapVersion >= newMapVersion) {
					deferred.resolve();
					return deferred.promise();
				}

				// get done state
				_.each(savedProperties, function (property) {
					if (!oldMapData.hasOwnProperty(property)) {
						return;
					}
					newMap[property] = oldMapData[property];
				});

				dbMaster.removeMap({
					type: newMap.type,
					jsMapKey: jsMapKey
				}).then(function () {
					dbMaster.insertMap(newMap, jsMapKey);
					deferred.resolve();
				});
				return deferred.promise();

			},

			insertMap: function (map, jsMapKey) { // map

				var maps = win.APP.maps,
					deferred = $.Deferred(),
					dbMaster = this,
					db = dbMaster.db,
					info;

				info = JSON.parse(JSON.stringify(map));

				info.units = null;
				delete info.units;
				info.buildings = null;
				delete info.buildings;
				info.terrain = null;
				delete info.terrain;

				db.transaction(function (tx) {
					tx.executeSql('INSERT INTO ' + map.type + ' (jsMapKey, info, map) values(?, ?, ?)', [jsMapKey, JSON.stringify(info), JSON.stringify(map)], function () {
						deferred.resolve();
					}, null);
				});

				maps[jsMapKey] = null;
				delete maps[jsMapKey];

				return deferred.promise();

			},

			removeMap: function (data) {

				var dbMaster = this,
					db = dbMaster.db,
					type = data.type,
					jsMapKey = data.jsMapKey,
					deferred = $.Deferred();

				db.transaction(function (tx) {
					tx.executeSql('DELETE FROM ' + type + ' WHERE jsMapKey = ?', [jsMapKey], function () {
						deferred.resolve();
					}, function () {
						deferred.resolve();
					});
				});

				return deferred.promise();

			},

			removeSave: function (name) {

				var dbMaster = this,
					db = dbMaster.db,
					deferred = $.Deferred();

				db.transaction(function (tx) {
					tx.executeSql('DELETE FROM ' + dbMaster.savedGame + ' WHERE name = ?', [name], function () {
						deferred.resolve();
					}, function () {
						deferred.resolve();
					});
				});

				return deferred.promise();

			},

			getMapsInfo: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db,
					mapsInfo = {};

				data.type = data.type || dbMaster.skirmishMaps;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + data.type + ' ORDER BY jsMapKey ASC', [], function (tx, results) {
						var i, len, row;
						for (i = 0, len = results.rows.length; i < len; i += 1) {
							row = results.rows.item(i);
							mapsInfo[row.jsMapKey] = JSON.parse(row.info);
						}
						deferred.resolve(mapsInfo);
					});
				});

				return deferred.promise();

			},

			getMapInfo: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db;

				data.type = data.type || dbMaster.skirmishMaps;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + data.type + ' WHERE jsMapKey=?', [data.jsMapKey], function (tx, results) {

						var row = results.rows.item(0),
							mapInfo = JSON.parse(row.info);

						deferred.resolve(mapInfo);

					});
				});

				return deferred.promise();

			},

			getMap: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db;

				data.type = data.type || dbMaster.skirmishMaps;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + data.type + ' WHERE jsMapKey=?', [data.jsMapKey], function (tx, results) {

						var row = results.rows.item(0),
							map = JSON.parse(row.map);

						deferred.resolve(map);

					});
				});

				return deferred.promise();

			},

			getMapList: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db,
					mapsInfo = {};

				data.type = data.type || dbMaster.skirmishMaps;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + data.type + ' ORDER BY jsMapKey ASC', [], function (tx, results) {
						var i, len, row;
						for (i = 0, len = results.rows.length; i < len; i += 1) {
							row = results.rows.item(i);
							mapsInfo[row.jsMapKey] = JSON.parse(row.info);
						}
						deferred.resolve(mapsInfo);
					});
				});

				return deferred.promise();

			},

			getAllMapList: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db,
					mapsInfo = {};

				data.type = data.type || dbMaster.skirmishMaps;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + data.type + ' ORDER BY jsMapKey ASC', [], function (tx, results) {
						var i, len, row;
						for (i = 0, len = results.rows.length; i < len; i += 1) {
							row = results.rows.item(i);
							mapsInfo[row.jsMapKey] = JSON.parse(row.map);
						}
						deferred.resolve(mapsInfo);
					});
				});

				return deferred.promise();

			},

			openMap: function (openMaps) {

				var dbMaster = this;

				_.each(openMaps, function (mapData) {
					dbMaster.getMap(mapData).then(function (map) {
						map.isOpen = true;
						dbMaster.removeMap(mapData).then(function () {
							dbMaster.insertMap(map, mapData.jsMapKey);
						});
					});
				});

			},

			setMapDone: function (mapData) {

				var dbMaster = this,
					difficultLevel = win.APP.info.get('difficult');

				dbMaster.getMap(mapData).then(function (map) {

					map.isDone = true;
					map['isDoneByDifficult_' + difficultLevel] = true;

					dbMaster.removeMap(mapData).then(function () {
						dbMaster.insertMap(map, mapData.jsMapKey);
					});

				});

			},

			saveGame: function (date, name, data) {

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db;

				_.each(data.map, function (value, key) {
					if (!/briefing/i.test(key)) { // save briefing only
						return;
					}
					_.each(value, function (briefing) {
						// detect onShow
						if (briefing.onShow && briefing.onShow.context && briefing.onShow.default_context) {
							briefing.onShow.context = briefing.onShow.default_context;
						}

						// detect onHide
						if (briefing.onHide && briefing.onHide.context && briefing.onHide.default_context) {
							briefing.onHide.context = briefing.onHide.default_context;
						}
					});
				});

				dbMaster
					.removeSave(name)
					.then(function () {
						db.transaction(function (tx) {
							tx.executeSql('INSERT INTO ' + dbMaster.savedGame + ' (date, name, game) values(?, ?, ?)', [date, name, JSON.stringify(data)], function () {
								deferred.resolve();
							}, null);
						});
					});

				return deferred.promise();

			},

			getSavedGames: function () {

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db,
					saves = [];

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + dbMaster.savedGame + ' ORDER BY date DESC', [], function (tx, results) {
						var i, len, row;
						for (i = 0, len = results.rows.length; i < len; i += 1) {
							row = results.rows.item(i);
							saves.push(row.name);
						}
						deferred.resolve(saves);
					});
				});

				return deferred.promise();

			},

			getSavedGame: function (gameName) {

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + dbMaster.savedGame + ' WHERE name=?', [gameName], function (tx, results) {
						deferred.resolve(results.rows.item(0));
					});
				});

				return deferred.promise();

			},

			mapIsExist: function (data) {

				var dbMaster = this,
					deferred = $.Deferred(),
					db = dbMaster.db;

				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM ' + data.type + ' WHERE jsMapKey=?', [data.jsMapKey], function (tx, results) {
						deferred.resolve(Boolean(results.rows.length));
					});
				});

				return deferred.promise();

			}

		}

	};

}(window, window.document));