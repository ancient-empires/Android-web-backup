/*jslint white: true, nomen: true */
(function (win) {

    "use strict";
    /*global window */
    /*global */

    win.addMap = function (map) {

        var dbMaster = win.APP.map.db,
            jsMapKey = 'userMap_' + map.name;

        dbMaster.removeMap({
            jsMapKey: jsMapKey,
            type: map.type
        }).then(function () {
            return dbMaster.insertMap(map, jsMapKey);
        });

    };

    win.saveMaps = function (data) {

        data = data || {};

        var dbMaster = win.APP.map.db;

        dbMaster.getAllMapList(data).then(function (mapList) {

            _.each(mapList, function (map, jsMapKey) {

                var canvas = document.createElement('canvas'),
                //canvas = $mapImageWrapper.get(0),
                    ctx = canvas.getContext('2d'),
                    view = win.APP.BB.BaseView.prototype,
                    getXYFromStringXY = view.util.getXYFromStringXY,
                    xyStr = view.util.getStringFromXY,
                    squareSize = win.APP.BB.BattleView.prototype.squareSize.max,
                    squareSizeX2,
                    mapTiles = win.APP.mapTiles,
                    terrains = map.terrain,
                    angleTypes = ['road', 'water'],
                    mapWidth = map.size.width,
                    mapHeight = map.size.height,
                    maxCanvasSize = 768 * 768 * 2 * 2;

                //if ( !this.info.get('isAndroid', true) ) { // for NOT android set size 24
                //	squareSize = 48; // see tiles image size 24 * 2
                //}

                // adjust square size
                while (mapWidth * mapHeight * squareSize * squareSize * 4 >= maxCanvasSize) {
                    squareSize -= 6;
                }

                //squareSize -= 6;

                squareSizeX2 = squareSize * 2;

                canvas.width = mapWidth * squareSizeX2;
                canvas.height = mapHeight * squareSizeX2;

                // reduce blur for ios devices
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false; // future

                // prepare buildings
                _.each(terrains, function (value, xy) {

                    var building = _.find(map.buildings, getXYFromStringXY(xy));

                    if (!building) {
                        return;
                    }

                    if ('farm' === building.type) {
                        terrains[xy] = 'terra-1';
                    } else {
                        terrains[xy] = 'road-1';
                    }

                });

                // draw main tiles
                _.each(terrains, function (value, xy) {
                    xy = getXYFromStringXY(xy);
                    ctx.drawImage(mapTiles[value].img, xy.x * squareSizeX2, xy.y * squareSizeX2, squareSizeX2, squareSizeX2);
                });

                function isReal(x, y) {
                    return x >= 0 && y >= 0 && x < mapWidth && y < mapHeight;
                }

                // draw angles road
                angleTypes.forEach(function (type) {

                    _.each(terrains, function (value, xy) {

                        if (value.indexOf(type) === -1) {
                            return;
                        }

                        xy = getXYFromStringXY(xy);

                        var x = xy.x,
                            y = xy.y,
                            xl = x - 1,
                            xr = x + 1,
                            yu = y - 1,
                            yd = y + 1,
                            xSquareSizeX2 = x * squareSizeX2,
                            ySquareSizeX2 = y * squareSizeX2,
                            xSquareSizeX2Half = xSquareSizeX2 + squareSize,
                            ySquareSizeX2Half = ySquareSizeX2 + squareSize,

                            terrain1Real = isReal(xl, yu) && terrains[xyStr(xl, yu)],
                            terrain2Real = isReal(x, yu) && terrains[xyStr(x, yu)],
                            terrain3Real = isReal(xr, yu) && terrains[xyStr(xr, yu)],
                            terrain4Real = isReal(xl, y) && terrains[xyStr(xl, y)],
                            terrain6Real = isReal(xr, y) && terrains[xyStr(xr, y)],
                            terrain7Real = isReal(xl, yd) && terrains[xyStr(xl, yd)],
                            terrain8Real = isReal(x, yd) && terrains[xyStr(x, yd)],
                            terrain9Real = isReal(xr, yd) && terrains[xyStr(xr, yd)],

                            terrain1 = terrain1Real || value,
                            terrain2 = terrain2Real || value,
                            terrain3 = terrain3Real || value,
                            terrain4 = terrain4Real || value,
                            terrain6 = terrain6Real || value,
                            terrain7 = terrain7Real || value,
                            terrain8 = terrain8Real || value,
                            terrain9 = terrain9Real || value,

                        // true if no bridge or no terrain type
                            t1 = terrain1.indexOf(type) && terrain1.indexOf('bridge'),
                            t2 = terrain2.indexOf(type) && terrain2.indexOf('bridge'),
                            t3 = terrain3.indexOf(type) && terrain3.indexOf('bridge'),
                            t4 = terrain4.indexOf(type) && terrain4.indexOf('bridge'),
                            t6 = terrain6.indexOf(type) && terrain6.indexOf('bridge'),
                            t7 = terrain7.indexOf(type) && terrain7.indexOf('bridge'),
                            t8 = terrain8.indexOf(type) && terrain8.indexOf('bridge'),
                            t9 = terrain9.indexOf(type) && terrain9.indexOf('bridge');

                        if (type === 'road') {

                            if (!terrain2Real) {
                                t2 = !t4 || !t6;
                            }

                            if (!terrain4Real) {
                                t4 = !t2 || !t8;
                            }

                            if (!terrain6Real) {
                                t6 = !t2 || !t8;
                            }

                            if (!terrain8Real) {
                                t8 = !t4 || !t6;
                            }

                        }

                        // draw 2, 4, 6, 8
                        if (t2) { // up is different type
                            ctx.drawImage(mapTiles['a-' + type + '-2'].img, xSquareSizeX2, ySquareSizeX2, squareSizeX2, squareSize);
                        }

                        if (t4) {
                            ctx.drawImage(mapTiles['a-' + type + '-4'].img, xSquareSizeX2, ySquareSizeX2, squareSize, squareSizeX2);
                        }

                        if (t6) {
                            ctx.drawImage(mapTiles['a-' + type + '-6'].img, xSquareSizeX2Half, ySquareSizeX2, squareSize, squareSizeX2);
                        }

                        if (t8) {
                            ctx.drawImage(mapTiles['a-' + type + '-8'].img, xSquareSizeX2, ySquareSizeX2Half, squareSizeX2, squareSize);
                        }

                        // draw 1, 3, 7, 9 - normal
                        if (t2 && t4) {
                            ctx.drawImage(mapTiles['a-' + type + '-1'].img, xSquareSizeX2, ySquareSizeX2, squareSize, squareSize);
                        }

                        if (t2 && t6) {
                            ctx.drawImage(mapTiles['a-' + type + '-3'].img, xSquareSizeX2Half, ySquareSizeX2, squareSize, squareSize);
                        }

                        if (t4 && t8) {
                            ctx.drawImage(mapTiles['a-' + type + '-7'].img, xSquareSizeX2, ySquareSizeX2Half, squareSize, squareSize);
                        }

                        if (t6 && t8) {
                            ctx.drawImage(mapTiles['a-' + type + '-9'].img, xSquareSizeX2Half, ySquareSizeX2Half, squareSize, squareSize);
                        }

                        // draw 1, 3, 7, 9 - small
                        if (!t2 && !t4 && t1) {
                            ctx.drawImage(mapTiles['a-' + type + '-1-s'].img, xSquareSizeX2, ySquareSizeX2, squareSize, squareSize);
                        }

                        if (!t2 && !t6 && t3) {
                            ctx.drawImage(mapTiles['a-' + type + '-3-s'].img, xSquareSizeX2Half, ySquareSizeX2, squareSize, squareSize);
                        }

                        if (!t4 && !t8 && t7) {
                            ctx.drawImage(mapTiles['a-' + type + '-7-s'].img, xSquareSizeX2, ySquareSizeX2Half, squareSize, squareSize);
                        }

                        if (!t6 && !t8 && t9) {
                            ctx.drawImage(mapTiles['a-' + type + '-9-s'].img, xSquareSizeX2Half, ySquareSizeX2Half, squareSize, squareSize);
                        }

                        // fix building

                    });

                });

                var element = document.createElement('a');
                element.setAttribute('href', canvas.toDataURL());
                element.setAttribute('download', jsMapKey + '.png');

                element.click();

            });

        });

    };

    win.saveMapsPreview = function (data) {

        data = data || {};

        var dbMaster = win.APP.map.db;

        dbMaster.getAllMapList(data).then(function (mapList) {

            _.each(mapList, function (map, jsMapKey) {

                var view = win.APP.BB.BaseView.prototype,
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    squareSize = win.APP.BB.BattleView.prototype.squareSize.max,
                    squareSizeX2,
                    terrains = map.terrain,
                    mapWidth = map.size.width,
                    mapHeight = map.size.height,
                    mapTilesPreview = win.APP.mapTilesPreview,
                    getXYFromStringXY = view.util.getXYFromStringXY,
                    buildings = map.buildings,
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

                var element = document.createElement('a');
                element.setAttribute('href', canvas.toDataURL());
                element.setAttribute('download', jsMapKey + '_preview.png');

                element.click();

            });

        });

    };

}(window));