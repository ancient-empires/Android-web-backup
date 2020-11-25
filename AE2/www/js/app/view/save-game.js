/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */
	/*global $, templateMaster, APP, Backbone */

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.SaveGameView = APP.BB.BaseView.extend({

		selectors: {
			setInputTextValue: '.js-set-input-text-value',
			saveInputText: '.js-save-input-text',
			savedList: '.js-saved-list',
			saveGame: '.js-save-game',
			removeSavedGame: '.js-remove-saved-game',
			savedItemWrapper: '.js-saved-item-wrapper',
			closeDeleteConfirm: '.js-close-delete-confirm',
			container: '.js-popup-container'
		},

		events: {
			// do not add events here
			//'click .js-save-game': 'saveGame'
		},

		initialize: function (data) {

			var view = this;

			view.extendFromObj(data);

			view.proto.initialize.apply(view, arguments);

			view.render();

		},

		render: function () {

			var view = this,
				saveName = view.getSaveName(),
				dbMaster = win.APP.map.db;

			view.$el = $(view.tmpl['save-game']({
				saveName: saveName
			}));

			dbMaster.getSavedGames().then(function (savedGames) {
				var html = view.tmpl['save-game-items']({ savedGames: savedGames });
				view.$el.find(view.selectors.savedList).html(html);
				view.undelegateEvents();
				view.bindEventListeners();
				view.autoSetSaveButtonState();
			});

		},

		bindEventListeners: function () {

			var view = this,
				selectors = view.selectors;

			view.unbindEventListeners();

			view.$el.find(selectors.saveGame).on('click', $.proxy(view, 'saveGame') );
			view.$el.find(selectors.removeSavedGame).on('click', $.proxy(view, 'removeSavedGame') );
			view.$el.find(selectors.closeDeleteConfirm).on('click', $.proxy(view, 'closeDeleteConfirm') );
			view.$el.find(selectors.saveInputText).on('input', $.proxy(view, 'autoSetSaveButtonState') );
			view.$el.find(selectors.saveInputText).on('focus', $.proxy(view, 'onFocusSaveInputText') );
			view.$el.find(selectors.saveInputText).on('blur', $.proxy(view, 'onBlurSaveInputText') );
			view.$el.find(selectors.setInputTextValue).on('click', $.proxy(view, 'setInputTextValue') );

		},

		unbindEventListeners: function () {

			var view = this,
				selectors = view.selectors;

			view.$el.find(selectors.saveGame).off('click', view.saveGame );
			view.$el.find(selectors.removeSavedGame).off('click', view.removeSavedGame );
			view.$el.find(selectors.closeDeleteConfirm).off('click', view.closeDeleteConfirm );
			view.$el.find(selectors.saveInputText).off('input', view.autoSetSaveButtonState );
			view.$el.find(selectors.saveInputText).off('focus',view.onFocusSaveInputText );
			view.$el.find(selectors.saveInputText).off('blur', view.onBlurSaveInputText );
			view.$el.find(selectors.setInputTextValue).off('click', view.setInputTextValue );

		},

		onFocusSaveInputText: function () {

			var view = this,
				$container = view.$el.closest(view.selectors.container);

			setTimeout(function () {
				$container.addClass('small-area-container');
			}, 400);

		},

		onBlurSaveInputText: function () {

			var view = this,
				$container = view.$el.closest(view.selectors.container);

			setTimeout(function () {
				$container.removeClass('small-area-container');
			}, 200);

		},

		autoSetSaveButtonState: function () {

			var view = this,
				lang = win.APP.lang,
				selectors = view.selectors,
				$inputText = view.$el.find(selectors.saveInputText),
				saveName = $inputText.val().trim(),
				$savedGame = view.$el.find(selectors.savedItemWrapper + '[data-save-name="' + saveName + '"]'),
				$saveGameButton = view.$el.find(selectors.saveGame);

			if ($savedGame.length) {
				$saveGameButton.html(lang.get('replace'));
			} else {
				$saveGameButton.html(lang.get('save'));
			}

		},

		setInputTextValue: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				saveName = $this.attr('data-save-name'),
				selectors = view.selectors,
				$inputText = view.$el.find(selectors.saveInputText);

			$inputText.val(saveName);

			view.autoSetSaveButtonState();

		},

		getSaveName: function () {

			var view = this,
				info = view.info,
				language = info.get('language'),
				battleView = view.get('battleView'),
				battleModel = view.get('battleModel'),
				map = battleModel.get('map'),
				mapName = map['name-' + language] || map.name,
				date = new Date(),
				saveName = mapName + ' ' + [date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getFullYear()].join('-');

			saveName = saveName.replace(/(\d+)/g, function (match, p1) {
				return p1.length > 1 ? p1 : 0 + p1;
			});

			return saveName;

		},

		saveGame: function () {

			var view = this,
				saveDate = Date.now(),
				saveName = view.$el.find(view.selectors.saveInputText).val().trim(),
				gameData = view.getDataToSave(),
				dbMaster = win.APP.map.db;

			view.setSaveButtonEnable(false);

			dbMaster
				.saveGame(saveDate, saveName, gameData)
				.then(function () {
					return dbMaster.getSavedGames()
				})
				.then(function (savedGames) {
					var html = view.tmpl['save-game-items']({ savedGames: savedGames });
					view.$el.find(view.selectors.savedList).html(html);
					view.undelegateEvents();
					view.setSaveButtonEnable(true);
					view.bindEventListeners();
					view.autoSetSaveButtonState();
					view.showTicket({
						popupData: {
							text: win.APP.lang.get('gameSaved') + '<br>' + saveName
						}
					});
				});

		},

		removeSavedGame: function (e) {

			var view = this,
				dbMaster = win.APP.map.db,
				$this = $(e.currentTarget),
				gameName = $this.attr('data-save-name'),
				$blocks,
				$block = view.$el.find(view.selectors.savedItemWrapper + '[data-save-name="' + gameName + '"]');

			$block.remove().empty();

			dbMaster.removeSave(gameName);

			$blocks = view.$el.find(view.selectors.savedItemWrapper);

			if ( !$blocks.length ) {
				view.$el.find(view.selectors.savedList).html(win.APP.lang.get('noSavedGames'))
			}

		},

		closeDeleteConfirm: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				gameName = $this.attr('data-save-name'),
				$button = view.$el.find('.js-tab-button[data-save-name="' + gameName + '"]');

			$button.trigger('click');

		},

		setSaveButtonEnable: function (isEnable) {

			var view = this,
				saveButton = view.$el.find(view.selectors.saveGame);

			return isEnable ? saveButton.removeClass('disable') : saveButton.addClass('disable');

		},

		getDataToSave: function () {

			// see battle model

			var view = this,
				battleView = view.get('battleView'),
				model = view.get('battleModel'),
				activePlayer,
				units = model.get('units'),
				buildings = model.get('buildings'),
				save = {
					turnCount: model.get('turnCount'),
					circleCount: model.get('circleCount'),
					players: model.get('players'),
					activePlayer: model.get('activePlayer'),
					units: [],
					buildings: buildings,
					jsMapKey: model.get('jsMapKey'),
					map: model.get('map'),
					unitLimit: model.get('unitLimit'),
					difficult: view.info.get('difficult'),
					graves: model.get('graves'),
					argsForRestart: battleView.get('argsForRestart')
				},
				doNotSaves = ['model', 'view'];

			// save players - ALL data - done
			// active player - save ID - done, save full player
			// save units - ALL data.toJSON(), active and no active - done
			// save buildings - ALL data - done
			// save map - terrain - full map done

			_.each(units, function (unit) {
				// toJSON is bad idea, save only needed data
				var unitData = {};
				_.each(unit.toJSON(), function (value, key) {
					return _.contains(doNotSaves, key) || (unitData[key] = value);
				});
				save.units.push(unitData);
			});

			return save;

		}

	});

}(window));
