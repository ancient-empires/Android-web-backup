/*jslint white: true, nomen: true */
(function (win, doc) {

	'use strict';
	/*global window, document */
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
					map = win.APP.map,
					info = win.APP.info,
					currentMapVersion = map.mapPackVersion,
					previousMapVersion = info.get('mapPackVersion') || 0,
					request;

				function createMapStore(db, storeName) {
					if (!db.objectStoreNames.contains(storeName)) {
						db.createObjectStore(storeName, { keyPath: 'jsMapKey' });
					}
				}

				function createSavedGameStore(db) {
					var store;

					if (!db.objectStoreNames.contains(dbMaster.savedGame)) {
						store = db.createObjectStore(dbMaster.savedGame, { keyPath: 'name' });
						store.createIndex('date', 'date', { unique: false });
					}
				}

				function prepareDefaultMaps() {
					dbMaster.prepareDefaultMap().then(function () {
						deferred.resolve();
					});
				}

				if (!win.indexedDB) {
					deferred.reject();
					return deferred.promise();
				}

				request = win.indexedDB.open(dbMaster.name, Number(dbMaster.version));

				request.onupgradeneeded = function (event) {
					var db = event.target.result;

					createMapStore(db, dbMaster.missionMaps);
					createMapStore(db, dbMaster.skirmishMaps);
					createMapStore(db, dbMaster.userMap);
					createSavedGameStore(db);
				};

				request.onsuccess = function (event) {
					dbMaster.db = event.target.result;

					if (currentMapVersion > previousMapVersion) { // remove all maps
						info.set('mapPackVersion', currentMapVersion);
						dbMaster.clearStore(dbMaster.skirmishMaps).then(prepareDefaultMaps, function () {
							deferred.reject();
						});
						return;
					}

					prepareDefaultMaps();
				};

				request.onerror = function () {
					deferred.reject();
				};

                return deferred.promise();

			},

			clearStore: function (type) {

				var dbMaster = this,
					deferred = $.Deferred(),
					request = dbMaster.db.transaction([type], 'readwrite').objectStore(type).clear();

				request.onsuccess = function () {
					deferred.resolve();
				};

				request.onerror = function () {
					deferred.reject();
				};

				return deferred.promise();

			},

			getRow: function (type, jsMapKey) {

				var dbMaster = this,
					deferred = $.Deferred(),
					request = dbMaster.db.transaction([type], 'readonly').objectStore(type).get(jsMapKey);

				request.onsuccess = function () {
					deferred.resolve(request.result);
				};

				request.onerror = function () {
					deferred.reject();
				};

				return deferred.promise();

			},

			getRows: function (type) {

				var dbMaster = this,
					deferred = $.Deferred(),
					rows = [],
					request = dbMaster.db.transaction([type], 'readonly').objectStore(type).openCursor();

				request.onsuccess = function (event) {
					var cursor = event.target.result;

					if (cursor) {
						rows.push(cursor.value);
						cursor.continue();
						return;
					}

					deferred.resolve(rows);
				};

				request.onerror = function () {
					deferred.reject();
				};

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
                    mapObj = win.APP.map,
                    deferred = $.Deferred();

                dbMaster.getRow(map.type, jsMapKey).then(function (row) {
                    if (row) {
                        dbMaster.compareMap(row, map, jsMapKey).then(function () {
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
					dbMaster.insertMap(newMap, jsMapKey).then(function () {
						deferred.resolve();
					});
				});
				return deferred.promise();

			},

			insertMap: function (map, jsMapKey) { // map

				var maps = win.APP.maps,
					deferred = $.Deferred(),
					dbMaster = this,
					info,
					request;

				info = JSON.parse(JSON.stringify(map));

				info.units = null;
				delete info.units;
				info.buildings = null;
				delete info.buildings;
				info.terrain = null;
				delete info.terrain;

				request = dbMaster.db.transaction([map.type], 'readwrite').objectStore(map.type).put({
					jsMapKey: jsMapKey,
					info: JSON.stringify(info),
					map: JSON.stringify(map)
				});

				request.onsuccess = function () {
					maps[jsMapKey] = null;
					delete maps[jsMapKey];
					deferred.resolve();
				};

				request.onerror = function () {
					deferred.reject();
				};

				return deferred.promise();

			},

			removeMap: function (data) {

				var dbMaster = this,
					type = data.type,
					jsMapKey = data.jsMapKey,
					deferred = $.Deferred(),
					request = dbMaster.db.transaction([type], 'readwrite').objectStore(type).delete(jsMapKey);

				request.onsuccess = function () {
					deferred.resolve();
				};

				request.onerror = function () {
					deferred.resolve();
				};

				return deferred.promise();

			},

			removeSave: function (name) {

				var dbMaster = this,
					deferred = $.Deferred(),
					request = dbMaster.db.transaction([dbMaster.savedGame], 'readwrite').objectStore(dbMaster.savedGame).delete(name);

				request.onsuccess = function () {
					deferred.resolve();
				};

				request.onerror = function () {
					deferred.resolve();
				};

				return deferred.promise();

			},

			getMapsInfo: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					mapsInfo = {};

				data.type = data.type || dbMaster.skirmishMaps;

				dbMaster.getRows(data.type).then(function (rows) {
					var i, len, row;
					for (i = 0, len = rows.length; i < len; i += 1) {
						row = rows[i];
						mapsInfo[row.jsMapKey] = JSON.parse(row.info);
					}
					deferred.resolve(mapsInfo);
				});

				return deferred.promise();

			},

			getMapInfo: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred();

				data.type = data.type || dbMaster.skirmishMaps;

				dbMaster.getRow(data.type, data.jsMapKey).then(function (row) {

					var mapInfo = JSON.parse(row.info);

					deferred.resolve(mapInfo);

				});

				return deferred.promise();

			},

			getMap: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred();

				data.type = data.type || dbMaster.skirmishMaps;

				dbMaster.getRow(data.type, data.jsMapKey).then(function (row) {

					var map = JSON.parse(row.map);

					deferred.resolve(map);

				});

				return deferred.promise();

			},

			getMapList: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					mapsInfo = {};

				data.type = data.type || dbMaster.skirmishMaps;

				dbMaster.getRows(data.type).then(function (rows) {
					var i, len, row;
					for (i = 0, len = rows.length; i < len; i += 1) {
						row = rows[i];
						mapsInfo[row.jsMapKey] = JSON.parse(row.info);
					}
					deferred.resolve(mapsInfo);
				});

				return deferred.promise();

			},

			getAllMapList: function (data) {

				data = data || {};

				var dbMaster = this,
					deferred = $.Deferred(),
					mapsInfo = {};

				data.type = data.type || dbMaster.skirmishMaps;

				dbMaster.getRows(data.type).then(function (rows) {
					var i, len, row;
					for (i = 0, len = rows.length; i < len; i += 1) {
						row = rows[i];
						mapsInfo[row.jsMapKey] = JSON.parse(row.map);
					}
					deferred.resolve(mapsInfo);
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
					request;

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
						request = dbMaster.db.transaction([dbMaster.savedGame], 'readwrite').objectStore(dbMaster.savedGame).put({
							date: date,
							name: name,
							game: JSON.stringify(data)
						});

						request.onsuccess = function () {
							deferred.resolve();
						};

						request.onerror = function () {
							deferred.reject();
						};
					});

				return deferred.promise();

			},

			getSavedGames: function () {

				var dbMaster = this,
					deferred = $.Deferred(),
					saves = [],
					request = dbMaster.db.transaction([dbMaster.savedGame], 'readonly').objectStore(dbMaster.savedGame).index('date').openCursor(null, 'prev');

				request.onsuccess = function (event) {
					var cursor = event.target.result;

					if (cursor) {
						saves.push(cursor.value.name);
						cursor.continue();
						return;
					}

					deferred.resolve(saves);
				};

				request.onerror = function () {
					deferred.reject();
				};

				return deferred.promise();

			},

			getSavedGame: function (gameName) {

				var dbMaster = this,
					deferred = $.Deferred(),
					request = dbMaster.db.transaction([dbMaster.savedGame], 'readonly').objectStore(dbMaster.savedGame).get(gameName);

				request.onsuccess = function () {
					deferred.resolve(request.result);
				};

				request.onerror = function () {
					deferred.reject();
				};

				return deferred.promise();

			},

			mapIsExist: function (data) {

				var dbMaster = this,
					deferred = $.Deferred();

				dbMaster.getRow(data.type, data.jsMapKey).then(function (row) {
					deferred.resolve(Boolean(row));
				});

				return deferred.promise();

			}

		}

	};

}(window, window.document));