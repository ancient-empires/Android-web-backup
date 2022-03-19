(function (win) {

	"use strict";
	/*global window, document */
	/*global bingo, $, info, APP, util */

	win.APP = win.APP || {};

	APP.MapsView = APP.BaseView.extend({
		templates: ['select-map'],
		events: {
			'click .js-go-to-battle': 'goToBattle',
			'dblclick .radio-button-wrapper': 'goToBattle'
		},
		init: function (data) {

			APP.notificationView.hideExtraWindows();

			util.clearTimeouts();

			this.$el = $(this.tmpl['select-map']({
				type: data.type,
				maps: this.getMapsArray()
			}));
			this.$wrapper = $('.js-wrapper');
			this.$wrapper.html('');
			this.$wrapper.append(this.$el);

			// workaround for color selection
			this.setColorSelectInputs();



		},
		goToBattle: function() {

			var data = this.createBattleControllerData();

			data.map = this.getMap();

			APP.battleView = new APP.BattleView(data);
			APP.router.navigate('battle', { trigger: true });

		},

		createBattleControllerData: function() {

			var forms = this.$el.find('.js-player-form'),
				data = {
					players: []
				};

			forms.forEach(function(form, index){
				var $form = $(form),
					player = {
						id: index,
						gold: APP.map.default.gold
					},
					inputs = $form.find('input');

				inputs.forEach(function(input){

					if ( !input.checked ) {
						return;
					}

					var type = input.dataset.type;
					player[type] = input.value;

				});

				data.players.push(player);

			});

			return data;

		},

		getMap: function() {

			var mapName = this.$el.find('.js-map-to-create-game:checked').data('js-name');

			return APP.maps[mapName];

		},
		getMapsArray: function() {

			var maps = APP.maps,
				key,
				mapsArray = [];

			for (key in maps) {
				if (maps.hasOwnProperty(key)) {
					mapsArray.push(maps[key]);
				}
			}

			return mapsArray;

		},

		setColorSelectInputs: function () {

			// find inputs

			var inputs = this.$el.find('[name=p1-color], [name=p2-color]');

			// add event listeners to change inputs state
			inputs.on('change', function () {

				var curName = this.name,
					value = this.value,
					relativeName = curName.replace(/(\d)/, function (match, p1) {
						return parseInt(p1) === 1 ? 2 : 1;
					}),
					relativeInputs = $('[name=' + relativeName + ']');

				relativeInputs.forEach(function (node) {
					node.removeAttribute('checked');
					node.checked = false;
				});

				relativeInputs.forEach(function (node) {
					if (node.value !== value) {
						node.checked = true;
					}
				});

			});


		}


	});

}(window));