/*jslint white: true, nomen: true */
(function (win) {

	"use strict";
	/*global console, alert, window, document, setTimeout */
	/*global APP, $, Backbone*/

	win.APP = win.APP || {};

	win.APP.BB = win.APP.BB || {};

	APP.BB.PopupView = APP.BB.BaseView.extend({

		events: {
			'click .js-popup-container': 'stopEvent',
			'click .js-confirmed-end-turn': 'confirmedEndTurn',
			'click .js-restart-battle': 'restartBattle',
			'click .js-quit-battle': 'quitBattle',
			'click .js-quit-map-editor': 'quitMapEditor',
			'click .js-open-map-in-editor': 'openMapInEditor',
			'click .js-delete-user-map': 'deleteUserMap',
			'click .js-clear-map': 'clearMap',
			'click .js-disable-all-tips': 'disableAllTips'
		},

		selectors: {
			popupContainer: '.js-popup-container'
		},

		initialize: function(data) {

			var view = this,
				popupUrl = view.popupUrl,
				url = win.location.href;

			if ( url.indexOf(popupUrl) === -1 ) {
				view.routeToPopup();
			}

			view.extendFromObj(data); // popupName, parentView, popupData(objToView)


			view.$el = $(view.tmpl['popup-wrapper']());

			view.$el.addClass(data.from || 'left');

			if (data.cssClass) {
				view.$el.addClass(data.cssClass);
			}

			view.proto.initialize.apply(this, arguments);

			view.render();

			view.showInAnimation();

		},

		render: function () {

			var view = this,
				append$el = view.get('append$el'),
				popupData = view.get('popupData') || {},
				playSound = view.get('playSound'),
				$content = $(view.tmpl[view.get('popupName')](popupData)),
				$container = view.$el.find(view.selectors.popupContainer),
				onShow = view.get('onShow'),
				context;

			if (playSound) {
				win.APP.soundMaster.play(playSound);
			}

			$container.html( $content.html() );

			if (append$el) {
				$container.append(append$el);
			}

			view.$wrapper.append('<div class="js-popup-protector popup-protector"></div>');
			view.$wrapper.append(view.$el);

			if (!onShow) {
				return;
			}

			context = onShow.context || view;
			context[onShow.fn].apply(context, onShow.args);

		},

		hide: function () {

			var view = this;

			if ( view.get('isHiding') ) {
				return;
			}

			view.set('isHiding', true);

			view.showOutAnimation().then(function () {

				var $popupProtector = view.$wrapper.find('.js-popup-protector');
				setTimeout(function () {
					$popupProtector.remove().empty();
				}, 50);

				view.proto.hide.call(view);
				view.get('deferred').resolve();

				var onHide = view.get('onHide'),
					//battleData = win.APP.bb.battleData,
					context;

				if (!onHide) {
					return;
				}

				context = onHide.context || view;

				//if ( onHide.fn === 'backTo' ) {
					//battleData.isEndGame = 'yes';
					//battleData.gameTo = 'quit';
				//}

				context[onHide.fn].apply(context, onHide.args);

			});

		},

		// actions

		confirmedEndTurn: function (e) {

			var view = this,
				parentView = view.get('parentView');

			view.stopEvent(e);
			view.routeBack();

			parentView.confirmedEndTurn();

		},

		restartBattle: function (e) {

			var view = this,
				parentView = view.get('parentView');

			//battleData = win.APP.bb.battleData;
			if (e && e.currentTarget && $(e.currentTarget).attr('data-on-hide') === 'none') {
				view.set('onHide', false);
			}

			//battleData.isEndGame = 'yes';
			//battleData.gameTo = 'restart';

			view.hide();
			view.routeBack();
			setTimeout(function () {
				parentView.restart();
			}, 50);

		},

		quitBattle: function (e) {

			var view = this;

			if (e && e.currentTarget && $(e.currentTarget).attr('data-on-hide') === 'none') {
				view.set('onHide', false);
			}

			//battleData = win.APP.bb.battleData;

			//battleData.isEndGame = 'yes';
			//battleData.gameTo = 'quit';

			//debugger
			//view.hide();
			//view.routeBack();

			view.backTo('play', { isForce: true });

		},

		quitMapEditor: function () {

			this.backTo('', { isForce: true });

		},

		showInAnimation: function () {

			var view = this;
			setTimeout(function () { // show animation
				view.$el.addClass('show-in');
			}, 50);

		},

		showOutAnimation: function () {

			var view = this,
				$el = view.$el,
				deferred = $.Deferred(),
				transitionEnd = view.info.get('transitionEnd', true);

			$el.one(transitionEnd, function () {
				deferred.resolve();
			}); // work only one time

			$el.addClass('show-out');

			return deferred.promise();

		},

		disableAllTips: function () {

			var view = this,
				info = view.info;

			info.set('help', 'off');
			view.autoShowHelpButton();
			view.routeBack();

		},

		openMapInEditor: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				parentView = view.get('parentView'),
				jsMapKey = $this.attr('data-map-name');

			win.APP.map.db.getMap({
				jsMapKey: jsMapKey,
				type: 'userMap'
			}).then(function (map) {
				parentView.initialize({
					map: map
				});
			});

		},

		openMap: function (jsMapKey, data) {

			new APP.BB.SkirmishSetupMapView(jsMapKey, data);

		},

		deleteUserMap: function (e) {

			var view = this,
				$this = $(e.currentTarget),
				parentView = view.get('parentView'),
				mapType = 'userMap',
				lang = win.APP.lang,
				mapName = $this.attr('data-user-map-name');

			parentView.deleteMap({
				mapName: mapName,
				jsMapKey: 'userMap_' + mapName,
				type: mapType
			});

			view.$el.find('.js-user-map-wrapper[data-user-map-name="' + mapName + '"]').remove().empty();

			if ( !view.$el.find('.js-user-map-wrapper').length ) {
				view.$el.find('.js-popup-header').html(lang.get('noSavedMaps'));
			}

		},

		clearMap: function () {

			var view = this,
				parentView = view.get('parentView');

			parentView.clearMap();

			view.routeBack();


		}

	});

}(window));