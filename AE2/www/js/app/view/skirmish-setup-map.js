/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global console, alert, window, document, setTimeout, clearTimeout */
	/*global APP, $, Backbone*/

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.SkirmishSetupMapView = APP.BB.BaseView.extend({

		events: {
			'click .js-go-to-battle': 'goToBattle'
		},

		initialize: function (jsMapKey, data) {

			if (win.APP.bb.router.isForce) {
				return;
			}

			data = data || {};

			var view = this,
				mapType = data.type || 'skirmish';

			view.set('jsMapKey', jsMapKey);
			view.set('mapType', mapType);

			if ( mapType === 'mission' ) {

				win.APP.map.db.getMapInfo({
					jsMapKey: jsMapKey,
					type: mapType
				}).then(function (mapInfo) {

					new win.APP.BB.BattleView({
						jsMapKey: jsMapKey,
						type: mapType,
						money: 500,
						unitLimit: mapInfo.unitLimit,
						players: [
							{
								teamNumber: 1,
								id: 0,
								type: 'player',
								color: 'blue'

							},
							{
								teamNumber: 2,
								id: 1,
								type: 'cpu',
								color: 'red'
							}
						]
					});

					view.navigate('battle');

				});

				return;
			}

			win.APP.map.db.getMapInfo({
				jsMapKey: jsMapKey,
				type: view.get('mapType')
			}).then(function (mapInfo) {
				var viewData = view.createViewData(mapInfo);
				view.$el = $(view.tmpl.skirmishSetupMap(viewData));
				view.proto.initialize.apply(view, arguments);
				view.render();
			});

		},

		createViewData: function (map) {

			var viewData = {},
				//util = win.APP.util,
				staticMapInfo = this.util.copyJSON(APP.map),
				i, len,
				playerData,
				playersData = [],
				colors = staticMapInfo.playerColors,
				playerType = staticMapInfo.playerTypes[0],
				list = {};

			function objToDataURL(obj) {
				return encodeURI(JSON.stringify(obj).replace(/\s/g, ''));
			}

			// set team number, color and type = cpu || player
			for (i = 1, len = map.maxPlayers; i <= len; i += 1) {
				playerData = {};
				playerData.teamNumber = i;
				playerData.color = colors[i-1];
				playersData.push(playerData);
				playerData.type = playerType;
			}
			viewData.playersData = playersData;

			// set money
			viewData.money = staticMapInfo.money[0];

			// set unit limit
			viewData.unitLimit = staticMapInfo.unitsLimits[0];

			// set lists
			// player types
			list.playerTypes = [];
			_.each(staticMapInfo.playerTypes, function (type) {
				list.playerTypes.push({
					key: type,
					value: win.APP.lang.get(type)
				});
			});
			list.playerTypes = objToDataURL(list.playerTypes);

			// team numbers
			list.teamNumber = [];
			for (i = 1, len = map.maxPlayers; i <= len; i += 1) {
				list.teamNumber.push({
					key: i,
					value: i
				});
			}
			list.teamNumber = objToDataURL(list.teamNumber);

			// money list
			list.money = [];
			_.each(staticMapInfo.money, function (value) {
				list.money.push({
					key: value,
					value: value
				});
			});
			list.money = objToDataURL(list.money);

			// money list
			list.unitsLimits = [];
			_.each(staticMapInfo.unitsLimits, function (value) {
				list.unitsLimits.push({
					key: value,
					value: value
				});
			});
			list.unitsLimits = objToDataURL(list.unitsLimits);

			viewData.list = list;

			return viewData;

		},

		goToBattle: function () {

			var data = {},
				$players = this.$el.find('.js-player-info-wrapper'),
				players = [],
				$money = this.$el.find('.js-money'),
				$unitLimit = this.$el.find('.js-unit-limit');

			data.jsMapKey = this.get('jsMapKey');
			data.type = this.get('mapType');

			data.money = parseInt($money.attr('data-key'), 10);

			data.unitLimit = parseInt($unitLimit.attr('data-key'), 10);

			$players.each(function (index) {

				var $this = $(this),
					teamNumber = parseInt($this.find('.js-player-team-number').attr('data-key'), 10),
					type = $this.find('.js-player-type').attr('data-key'),
					color = $this.find('.js-player-color').attr('data-player-color');

				players.push({
					teamNumber: teamNumber,
					id: index,
					type: type,
					color: color
				});

			});

			data.players = players;

			new win.APP.BB.BattleView(data);

			this.navigate('battle');

		}

	});

}(window));