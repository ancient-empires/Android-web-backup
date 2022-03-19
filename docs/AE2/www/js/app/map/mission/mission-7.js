/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */
	/*global */

	var langEn = win.APP.languages.en,
		langRu = win.APP.languages.ru,
		langEs = win.APP.languages.es,
		langZh = win.APP.languages.zh,
		langEnExtra = {
			name: 'RENDEZVOUS',
			objective: 'Carve a path to the west through the enemy troops, defeat their commander and occupy all castles! Galamar and Valadorn must survive.'
		},
		langRuExtra = {
			name: 'ВСТРЕЧА',
			objective: 'Пробить путь на запад через вражеские войска, убить их командира и занять все замки! Король Галамар и Король Валадорн должны выжить.'
		},
		langEsExtra = {
			name: 'REUNIÓN',
			objective: 'Tallar un camino hacia el oeste a través de las tropas enemigas, derrotar a su comandante y ocupar todos los castillos! Galamar y Valadorn deben sobrevivir.'
		},
		langZhExtra = {
			name: '会和',
			objective: '穿过敌方部队，占领他们的城堡并击败所有敌人。格拉玛与渥拉顿必须存活。'
		};

	win.APP.maps.mission_001_007 = {
		version: 11,
		type: 'mission',
		isOpen: false,
		openMaps: [
			{jsMapKey: 'mission_001_008', type: 'mission'}
		],
		size: {width: 16, height: 18},
		maxPlayers: 2,
		unitLimit: 25,
		money: [
			{playerId: 0, money: 400},
			{playerId: 1, money: 400}
		],
		win: ['noEnemyUnit', 'allCastles'], // allCastles, noEnemyUnit, allUnorderedCasesIsDone
		defeat: ['commanderIsDead'], // 'galamarDead', 'valadornDead', crystalIsDead

		// en
		name: langEnExtra.name,
		objective: langEnExtra.objective,
		startBriefing: [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Outside the City'
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEnExtra.name,
					text: langEnExtra.objective
				}
			}
		],
		n1Briefing: [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Run, pitiful human, before it is too late!',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 0, y: 8 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'The enemy force looks formidable, I recommend retreat.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 14, y: 7 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'We have no choice but to attack!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Galamar! We came as fast as we could! Let us fight side by side!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 13, y: 16 }]
				}
			}
		],
		endBriefing: [
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEn.missionComplete
				},
				playSound: {
					sound: 'victory.mp3',
					road: 0,
					isLoop: false
				},
				onHide: {
					fn: 'openMap',
					args: ['mission_001_008', { type: 'mission' }]
				}
			}
		],

		// es
		'name-es': langEsExtra.name,
		'objective-es': langEsExtra.objective,
		'startBriefing-es': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Fuera de la Ciudad'
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEsExtra.name,
					text: langEsExtra.objective
				}
			}
		],
		'n1Briefing-es': [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Corran, lamentables humanos, antes de que sea demasiado tarde!',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 0, y: 8 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Las fuerzas enemigas lucen formidables, recomiendo una retirada.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 14, y: 7 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡No tenemos otra opción mas que atacar!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Galamar! ¡Venimos los más ráído que pudimos! ¡Permitenos pelear lado a lado!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 13, y: 16 }]
				}
			}

		],
		'endBriefing-es': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEs.missionComplete
				},
				playSound: {
					sound: 'victory.mp3',
					road: 0,
					isLoop: false
				},
				onHide: {
					fn: 'openMap',
					args: ['mission_001_008', { type: 'mission' }]
				}
			}
		],

		// ru
		'name-ru': langRuExtra.name,
		'objective-ru': langRuExtra.objective,
		'startBriefing-ru': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'За Городом'
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langRuExtra.name,
					text: langRuExtra.objective
				}
			}
		],
		'n1Briefing-ru': [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Беги, жалкий человечишко, пока еще не слишком поздно!',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 0, y: 8 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Вражеские войска выглядят угрожающе, я рекомендую отступить.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 14, y: 7 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'У нас нет иного выбора кроме атаки!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Галамар! Мы пришли так быстро как могли! Будем сражаться бок о бок!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 13, y: 16 }]
				}
			}

		],
		'endBriefing-ru': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: langRu.missionComplete
				},
				playSound: {
					sound: 'victory.mp3',
					road: 0,
					isLoop: false
				},
				onHide: {
					fn: 'openMap',
					args: ['mission_001_008', { type: 'mission' }]
				}
			}
		],

		// zh
		'name-zh': langZhExtra.name,
		'objective-zh': langZhExtra.objective,
		'startBriefing-zh': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: '外城'
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langZhExtra.name,
					text: langZhExtra.objective
				}
			}
		],
		'n1Briefing-zh': [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '冲啊！勇敢的战士们！趁现在还来得及！',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 0, y: 8 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '敌人们太强大了，我建议撤退！',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 14, y: 7 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '我们除了进攻外没有别的选择！',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '格拉玛！我们以最快速度赶到了！让我们再次一起战斗吧！',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 13, y: 16 }]
				}
			}

		],
		'endBriefing-zh': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: langZh.missionComplete
				},
				playSound: {
					sound: 'victory.mp3',
					road: 0,
					isLoop: false
				},
				onHide: {
					fn: 'openMap',
					args: ['mission_001_008', { type: 'mission' }]
				}
			}
		],

		cases: [
			{
				isDone: false,
				detect: 'turnCount',
				turnCount: 15,
				do: ['appendUnits', 'showBriefing'],
				units: [
					{x: 12, y: 14, type: 'soldier', ownerId: 1},
					{x: 14, y: 14, type: 'golem', ownerId: 1},
					{x: 13, y: 12, type: 'elemental', ownerId: 1},
					{x: 13, y: 15, type: 'sorceress', ownerId: 1},
					{x: 12, y: 16, type: 'golem', ownerId: 0},
					{x: 13, y: 16, type: 'valadorn', ownerId: 0},
					{x: 14, y: 16, type: 'dragon', ownerId: 0},
					{x: 13, y: 17, type: 'wisp', ownerId: 0},
					{x: 12, y: 17, type: 'archer', ownerId: 0},
					{x: 0, y: 8, type: 'demon-lord', ownerId: 1},
					{x: 1, y: 10, type: 'soldier', ownerId: 1},
					{x: 3, y: 8, type: 'soldier', ownerId: 1},
					{x: 4, y: 9, type: 'golem', ownerId: 1},
					{x: 5, y: 10, type: 'golem', ownerId: 1},
					{x: 2, y: 10, type: 'dragon', ownerId: 1},
					{x: 4, y: 8, type: 'dragon', ownerId: 1},
					{x: 2, y: 9, type: 'wisp', ownerId: 1}
				],
				briefingName: 'n1Briefing'
			}
		],

		units: [
			{x: 14, y: 3, type: 'galamar', ownerId: 0},
			{x: 14, y: 2, type: 'soldier', ownerId: 0},
			{x: 14, y: 1, type: 'archer', ownerId: 0},
			{x: 13, y: 1, type: 'sorceress', ownerId: 0},
			{x: 12, y: 7, type: 'sorceress', ownerId: 1},
			{x: 13, y: 8, type: 'archer', ownerId: 1},
			{x: 13, y: 7, type: 'soldier', ownerId: 1},
			{x: 14, y: 7, type: 'dire-wolf', ownerId: 1}
		],
		buildings: [
			{x: 0, y: 8, type: 'castle', state: 'normal'},
			{x: 3, y: 8, type: 'farm', state: 'destroyed'},
			{x: 1, y: 10, type: 'farm', state: 'destroyed'},
			{x: 0, y: 13, type: 'farm', state: 'normal'},
			{x: 3, y: 14, type: 'farm', state: 'normal'},
			{x: 13, y: 14, type: 'well', state: 'normal'},
			{x: 14, y: 9, type: 'farm', state: 'destroyed'},
			{x: 8, y: 9, type: 'farm', state: 'destroyed'},
			{x: 11, y: 7, type: 'farm', state: 'destroyed'},
			{x: 8, y: 4, type: 'farm', state: 'destroyed'},
			{x: 11, y: 8, type: 'well', state: 'normal'},
			{x: 12, y: 9, type: 'castle', state: 'normal'}
		],
		terrain: {
			x0y0: 'stone-1',
			x0y1: 'water-1',
			x0y2: 'water-1',
			x0y3: 'water-1',
			x0y4: 'water-1',
			x0y5: 'stone-1',
			x1y0: 'forest-1',
			x1y1: 'water-1',
			x1y2: 'water-1',
			x1y3: 'water-2',
			x1y4: 'water-1',
			x1y5: 'forest-1',
			x2y0: 'water-1',
			x2y1: 'water-1',
			x2y2: 'water-1',
			x2y3: 'water-1',
			x2y4: 'water-1',
			x2y5: 'water-1',
			x3y0: 'water-1',
			x3y1: 'water-3',
			x3y2: 'water-1',
			x3y3: 'water-1',
			x3y4: 'water-1',
			x3y5: 'water-1',
			x4y0: 'water-1',
			x4y1: 'water-1',
			x4y2: 'water-1',
			x4y3: 'water-1',
			x4y4: 'water-1',
			x4y5: 'terra-1',
			x5y0: 'stone-1',
			x5y1: 'water-1',
			x5y2: 'water-1',
			x5y3: 'water-1',
			x5y4: 'water-1',
			x5y5: 'bridge-1',
			x6y0: 'forest-1',
			x6y1: 'water-1',
			x6y2: 'water-1',
			x6y3: 'water-3',
			x6y4: 'water-1',
			x6y5: 'bridge-1',
			x7y0: 'forest-2',
			x7y1: 'water-1',
			x7y2: 'water-1',
			x7y3: 'water-1',
			x7y4: 'water-1',
			x7y5: 'forest-2',
			x8y0: 'stone-1',
			x8y1: 'forest-2',
			x8y2: 'stone-1',
			x8y3: 'hill-1',
			x8y4: 'terra-1',
			x8y5: 'hill-1',
			x9y0: 'stone-1',
			x9y1: 'stone-1',
			x9y2: 'forest-1',
			x9y3: 'stone-1',
			x9y4: 'terra-1',
			x9y5: 'forest-1',
			x10y0: 'stone-1',
			x10y1: 'forest-2',
			x10y2: 'hill-1',
			x10y3: 'forest-1',
			x10y4: 'forest-1',
			x10y5: 'terra-1',
			x11y0: 'forest-1',
			x11y1: 'terra-1',
			x11y2: 'stone-1',
			x11y3: 'terra-1',
			x11y4: 'stone-1',
			x11y5: 'stone-1',
			x12y0: 'forest-1',
			x12y1: 'forest-2',
			x12y2: 'terra-1',
			x12y3: 'forest-1',
			x12y4: 'stone-1',
			x12y5: 'hill-1',
			x13y0: 'road-1',
			x13y1: 'road-1',
			x13y2: 'hill-1',
			x13y3: 'forest-2',
			x13y4: 'road-1',
			x13y5: 'road-1',
			x14y0: 'stone-1',
			x14y1: 'road-1',
			x14y2: 'road-1',
			x14y3: 'road-1',
			x14y4: 'road-1',
			x14y5: 'stone-1',
			x15y0: 'stone-1',
			x15y1: 'forest-1',
			x15y2: 'stone-1',
			x15y3: 'forest-1',
			x15y4: 'stone-1',
			x15y5: 'forest-2',
			x0y6: 'forest-1',
			x1y6: 'hill-1',
			x2y6: 'forest-1',
			x3y6: 'forest-2',
			x4y6: 'terra-1',
			x5y6: 'water-1',
			x6y6: 'water-1',
			x7y6: 'terra-1',
			x8y6: 'terra-1',
			x9y6: 'forest-2',
			x10y6: 'forest-1',
			x11y6: 'forest-1',
			x12y6: 'forest-2',
			x13y6: 'road-1',
			x14y6: 'terra-1',
			x15y6: 'forest-1',
			x0y7: 'forest-2',
			x1y7: 'terra-1',
			x2y7: 'forest-2',
			x3y7: 'terra-1',
			x4y7: 'stone-1',
			x5y7: 'water-1',
			x6y7: 'water-1',
			x7y7: 'water-1',
			x8y7: 'stone-1',
			x9y7: 'terra-1',
			x10y7: 'terra-1',
			x11y7: 'terra-1',
			x12y7: 'terra-1',
			x13y7: 'road-1',
			x14y7: 'terra-1',
			x15y7: 'forest-1',
			x0y8: 'terra-1',
			x1y8: 'hill-1',
			x2y8: 'terra-1',
			x3y8: 'terra-1',
			x4y8: 'forest-2',
			x5y8: 'water-1',
			x6y8: 'water-1',
			x7y8: 'water-1',
			x8y8: 'forest-2',
			x9y8: 'hill-1',
			x10y8: 'terra-1',
			x11y8: 'terra-1',
			x12y8: 'forest-2',
			x13y8: 'road-1',
			x14y8: 'forest-1',
			x15y8: 'forest-1',
			x0y9: 'road-1',
			x1y9: 'road-1',
			x2y9: 'road-1',
			x3y9: 'road-1',
			x4y9: 'road-1',
			x5y9: 'hill-1',
			x6y9: 'water-1',
			x7y9: 'water-1',
			x8y9: 'terra-1',
			x9y9: 'stone-1',
			x10y9: 'hill-1',
			x11y9: 'terra-1',
			x12y9: 'terra-1',
			x13y9: 'road-1',
			x14y9: 'terra-1',
			x15y9: 'stone-1',
			x0y10: 'forest-2',
			x1y10: 'terra-1',
			x2y10: 'hill-1',
			x3y10: 'terra-1',
			x4y10: 'road-1',
			x5y10: 'road-1',
			x6y10: 'bridge-1',
			x7y10: 'bridge-1',
			x8y10: 'road-1',
			x9y10: 'road-1',
			x10y10: 'road-1',
			x11y10: 'road-1',
			x12y10: 'road-1',
			x13y10: 'road-1',
			x14y10: 'stone-1',
			x15y10: 'water-1',
			x0y11: 'terra-1',
			x1y11: 'stone-1',
			x2y11: 'forest-2',
			x3y11: 'stone-1',
			x4y11: 'forest-1',
			x5y11: 'water-1',
			x6y11: 'water-1',
			x7y11: 'water-1',
			x8y11: 'forest-1',
			x9y11: 'water-1',
			x10y11: 'water-1',
			x11y11: 'water-1',
			x12y11: 'bridge-2',
			x13y11: 'water-1',
			x14y11: 'water-1',
			x15y11: 'water-1',
			x0y12: 'forest-1',
			x1y12: 'terra-1',
			x2y12: 'terra-1',
			x3y12: 'forest-1',
			x4y12: 'stone-1',
			x5y12: 'water-1',
			x6y12: 'water-1',
			x7y12: 'water-1',
			x8y12: 'water-1',
			x9y12: 'water-1',
			x10y12: 'water-1',
			x11y12: 'water-1',
			x12y12: 'bridge-2',
			x13y12: 'water-1',
			x14y12: 'water-1',
			x15y12: 'water-1',
			x0y13: 'terra-1',
			x1y13: 'hill-1',
			x2y13: 'terra-1',
			x3y13: 'hill-1',
			x4y13: 'forest-1',
			x5y13: 'hill-1',
			x6y13: 'water-1',
			x7y13: 'water-3',
			x8y13: 'water-1',
			x9y13: 'water-1',
			x10y13: 'water-1',
			x11y13: 'hill-1',
			x12y13: 'road-1',
			x13y13: 'terra-1',
			x14y13: 'stone-1',
			x15y13: 'forest-1',
			x0y14: 'forest-1',
			x1y14: 'terra-1',
			x2y14: 'forest-2',
			x3y14: 'terra-1',
			x4y14: 'terra-1',
			x5y14: 'forest-2',
			x6y14: 'water-1',
			x7y14: 'water-1',
			x8y14: 'water-1',
			x9y14: 'water-1',
			x10y14: 'forest-2',
			x11y14: 'terra-1',
			x12y14: 'road-1',
			x13y14: 'terra-1',
			x14y14: 'forest-2',
			x15y14: 'terra-1',
			x0y15: 'stone-1',
			x1y15: 'forest-1',
			x2y15: 'stone-1',
			x3y15: 'forest-1',
			x4y15: 'water-1',
			x5y15: 'water-1',
			x6y15: 'water-1',
			x7y15: 'water-1',
			x8y15: 'water-1',
			x9y15: 'stone-1',
			x10y15: 'forest-1',
			x11y15: 'stone-1',
			x12y15: 'road-1',
			x13y15: 'road-1',
			x14y15: 'terra-1',
			x15y15: 'stone-1',
			x0y16: 'forest-1',
			x1y16: 'forest-2',
			x2y16: 'forest-1',
			x3y16: 'water-1',
			x4y16: 'water-1',
			x5y16: 'water-1',
			x6y16: 'water-2',
			x7y16: 'water-1',
			x8y16: 'water-1',
			x9y16: 'forest-1',
			x10y16: 'hill-1',
			x11y16: 'terra-1',
			x12y16: 'terra-1',
			x13y16: 'road-1',
			x14y16: 'stone-1',
			x15y16: 'forest-2',
			x0y17: 'forest-1',
			x1y17: 'stone-1',
			x2y17: 'water-1',
			x3y17: 'water-1',
			x4y17: 'water-1',
			x5y17: 'water-1',
			x6y17: 'water-1',
			x7y17: 'water-1',
			x8y17: 'forest-1',
			x9y17: 'forest-2',
			x10y17: 'stone-1',
			x11y17: 'forest-1',
			x12y17: 'stone-1',
			x13y17: 'road-1',
			x14y17: 'hill-1',
			x15y17: 'forest-1'
		}
	};


}(window));