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
			name: 'ESCORT DUTY',
			objective: 'Deliver the Crystal south to the city of Thorin. King Galamar must survive.'
		},
		langRuExtra = {
			name: 'СЛУЖБА ЭСКОРТА',
			objective: 'Доставить Кристалл на юг в город Торин. Король Галамар должен выжить.'
		},
		langEsExtra = {
			name: 'EL DEBER DE ESCOLTA',
			objective: 'Entrega el Cristal al sur de la ciudad de Thorin. El Rey Galamar debe sobrevivir.'
		},
		langZhExtra = {
			name: '护航',
			objective: '保护水晶成功运送，格拉玛必须生存。'
		};

	win.APP.maps.mission_001_005 = {
		version: 11,
		type: 'mission',
		isOpen: false,
		openMaps: [
			{jsMapKey: 'mission_001_006', type: 'mission'}
		],
		size: {width: 20, height: 12},
		maxPlayers: 2,
		unitLimit: 25,
		//win: ['noEnemyUnit', 'allUnorderedCasesIsDone'], // allCastles, noEnemyUnit, allUnorderedCasesIsDone
		win: ['noEnemyUnit', 'allOrderedCasesIsDone'], // allCastles, noEnemyUnit, allUnorderedCasesIsDone
		defeat: ['commanderIsDead', 'crystalIsDead'], // 'galamarDead', 'valadornDead', crystalIsDead

		// en
		name: langEnExtra.name,
		objective: langEnExtra.objective,
		startBriefing: [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Pathway to Thorin'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Your Highness, I do not like the look of this forest, we must be careful!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 11 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Very well, Captain. Let us follow this path and stay on our guard.',
					img: 'i/face/galamar.png'
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
					text: 'Ambush! Protect the Crystal at all cost!',
					img: 'i/face/soldier.png'
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
					args: ['mission_001_006', { type: 'mission' }]
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
					header: 'Camino hacia Thorin'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Su Majestad, No me gusta como luce este bosque, ¡debemos ser cuidadosos!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 11 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Muy bien, Capitán. Seguiremos este camino y nos mantendremos en guardia.',
					img: 'i/face/galamar.png'
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
					text: '¡Emboscada! ¡Protejan el Cristal a cualquier costo!',
					img: 'i/face/soldier.png'
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
					args: ['mission_001_006', { type: 'mission' }]
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
					header: 'Путь в Торин'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Ваше Высочество, мне не нравится, как выглядит этот лес, мы должны быть осторожны!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 11 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Очень хорошо, Капитан. Давайте проследуем этим путем и останемся под защитой нашей охраны.',
					img: 'i/face/galamar.png'
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
					text: 'Засада! Защитите Кристалл любой ценой!',
					img: 'i/face/soldier.png'
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
					args: ['mission_001_006', { type: 'mission' }]
				}
			}
		],

		// ru
		'name-zh': langZhExtra.name,
		'objective-zh': langZhExtra.objective,
		'startBriefing-zh': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: '途径索林'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '上帝啊，我并不喜欢这个森林，警戒！',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 11 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '非常好，长官，让我们一路小心..',
					img: 'i/face/galamar.png'
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
					text: '必须不计一切代价保护好水晶！',
					img: 'i/face/soldier.png'
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
					args: ['mission_001_006', { type: 'mission' }]
				}
			}
		],

		//unorderedCases: [
		orderedCases: [
			{
				isDone: false,
				detect: 'unitOnPlace',
				do: ['appendUnits', 'showBriefing'],
				place: [
					{
						x1: 0,
						y1: 0,
						x2: 8,
						y2: 11
					}
				],
				units: [
					{
						type: 'skeleton',
						ownerId: 1,
						x: 4,
						y: 1
					},
					{
						type: 'archer',
						ownerId: 1,
						x: 5,
						y: 2
					},
					{
						type: 'skeleton',
						ownerId: 1,
						x: 4,
						y: 3
					}
				],
				briefingName: 'n1Briefing'
			},

			{
				isDone: false,
				detect: 'unitOnPlace',
				do: ['appendUnits'],
				place: [
					{
						x1: 0,
						y1: 7,
						x2: 19,
						y2: 11
					}
				],
				units: [
					{
						type: 'archer',
						ownerId: 1,
						x: 5,
						y: 10
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 7,
						y: 9
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 7,
						y: 8
					}
				]
			},
			{
				isDone: false,
				detect: 'unitOnPlace',
				do: ['appendUnits'],
				place: [
					{
						x1: 7,
						y1: 6,
						x2: 19,
						y2: 11
					}
				],
				units: [
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 11,
						y: 5
					},
					{
						type: 'golem',
						ownerId: 1,
						x: 12,
						y: 6
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 12,
						y: 7
					}
				]
			},
			{
				isDone: false,
				detect: 'unitOnPlace',
				do: ['appendUnits'],
				place: [
					{
						x1: 15,
						y1: 8,
						x2: 19,
						y2: 11
					}
				],
				units: [
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 16,
						y: 10
					},
					{
						type: 'golem',
						ownerId: 1,
						x: 17,
						y: 10
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 18,
						y: 10
					},
					{
						type: 'archer',
						ownerId: 1,
						x: 18,
						y: 9
					}
				]
			}
		],

		units: [
			{x: 11, y: 0, type: 'crystal', ownerId: 0},
			{x: 11, y: 1, type: 'galamar', ownerId: 0},
			{x: 12, y: 0, type: 'archer', ownerId: 0},
			{x: 12, y: 1, type: 'sorceress', ownerId: 0},
			{x: 11, y: 2, type: 'soldier', ownerId: 0},
			{x: 10, y: 1, type: 'dire-wolf', ownerId: 0}
		],
		buildings: [
			{x: 2, y: 1, type: 'temple', state: 'normal'},
			{x: 7, y: 5, type: 'temple', state: 'normal'},
			{x: 6, y: 10, type: 'well', state: 'normal'},
			{x: 4, y: 4, type: 'well', state: 'normal'},
			{x: 12, y: 5, type: 'well', state: 'normal'},
			{x: 18, y: 8, type: 'well', state: 'normal'},
			{x: 12, y: 8, type: 'temple', state: 'normal'}
		],
		terrain: {
			x0y0: 'stone-1',
			x0y1: 'stone-1',
			x0y2: 'stone-1',
			x0y3: 'forest-2',
			x0y4: 'stone-1',
			x0y5: 'forest-1',
			x1y0: 'stone-1',
			x1y1: 'stone-1',
			x1y2: 'forest-1',
			x1y3: 'hill-1',
			x1y4: 'terra-1',
			x1y5: 'terra-1',
			x2y0: 'stone-1',
			x2y1: 'terra-1',
			x2y2: 'road-1',
			x2y3: 'road-1',
			x2y4: 'road-1',
			x2y5: 'road-1',
			x3y0: 'forest-1',
			x3y1: 'terra-1',
			x3y2: 'road-1',
			x3y3: 'terra-1',
			x3y4: 'hill-1',
			x3y5: 'forest-1',
			x4y0: 'stone-1',
			x4y1: 'hill-1',
			x4y2: 'road-1',
			x4y3: 'terra-1',
			x4y4: 'terra-1',
			x4y5: 'stone-1',
			x5y0: 'forest-2',
			x5y1: 'terra-1',
			x5y2: 'road-1',
			x5y3: 'forest-1',
			x5y4: 'forest-1',
			x5y5: 'stone-1',
			x6y0: 'stone-1',
			x6y1: 'forest-2',
			x6y2: 'road-1',
			x6y3: 'road-1',
			x6y4: 'stone-1',
			x6y5: 'terra-1',
			x7y0: 'stone-1',
			x7y1: 'forest-1',
			x7y2: 'hill-1',
			x7y3: 'road-1',
			x7y4: 'stone-1',
			x7y5: 'terra-1',
			x8y0: 'forest-1',
			x8y1: 'stone-1',
			x8y2: 'forest-1',
			x8y3: 'road-1',
			x8y4: 'stone-1',
			x8y5: 'hill-1',
			x9y0: 'terra-1',
			x9y1: 'forest-1',
			x9y2: 'forest-2',
			x9y3: 'road-1',
			x9y4: 'forest-2',
			x9y5: 'stone-1',
			x0y6: 'stone-1',
			x1y6: 'hill-1',
			x2y6: 'road-1',
			x3y6: 'forest-1',
			x4y6: 'stone-1',
			x5y6: 'stone-1',
			x6y6: 'hill-1',
			x7y6: 'road-1',
			x8y6: 'road-1',
			x9y6: 'road-1',
			x0y7: 'forest-2',
			x1y7: 'terra-1',
			x2y7: 'road-1',
			x3y7: 'forest-2',
			x4y7: 'forest-1',
			x5y7: 'forest-2',
			x6y7: 'road-1',
			x7y7: 'road-1',
			x8y7: 'terra-1',
			x9y7: 'hill-1',
			x0y8: 'forest-1',
			x1y8: 'forest-2',
			x2y8: 'road-1',
			x3y8: 'terra-1',
			x4y8: 'forest-2',
			x5y8: 'hill-1',
			x6y8: 'road-1',
			x7y8: 'hill-1',
			x8y8: 'stone-1',
			x9y8: 'stone-1',
			x0y9: 'forest-1',
			x1y9: 'forest-1',
			x2y9: 'road-1',
			x3y9: 'road-1',
			x4y9: 'road-1',
			x5y9: 'road-1',
			x6y9: 'road-1',
			x7y9: 'terra-1',
			x8y9: 'hill-1',
			x9y9: 'stone-1',
			x0y10: 'stone-1',
			x1y10: 'stone-1',
			x2y10: 'forest-2',
			x3y10: 'stone-1',
			x4y10: 'terra-1',
			x5y10: 'hill-1',
			x6y10: 'terra-1',
			x7y10: 'forest-1',
			x8y10: 'forest-2',
			x9y10: 'stone-1',
			x0y11: 'forest-2',
			x1y11: 'stone-1',
			x2y11: 'stone-1',
			x3y11: 'forest-1',
			x4y11: 'stone-1',
			x5y11: 'stone-1',
			x6y11: 'stone-1',
			x7y11: 'stone-1',
			x8y11: 'stone-1',
			x9y11: 'forest-1',
			x10y0: 'terra-1',
			x10y1: 'forest-1',
			x10y2: 'terra-1',
			x10y3: 'road-1',
			x10y4: 'stone-1',
			x10y5: 'terra-1',
			x10y6: 'road-1',
			x10y7: 'stone-1',
			x10y8: 'stone-1',
			x10y9: 'forest-1',
			x10y10: 'forest-2',
			x10y11: 'stone-1',
			x11y0: 'road-1',
			x11y1: 'road-1',
			x11y2: 'road-1',
			x11y3: 'road-1',
			x11y4: 'stone-1',
			x11y5: 'terra-1',
			x11y6: 'road-1',
			x11y7: 'stone-1',
			x11y8: 'hill-1',
			x11y9: 'forest-1',
			x11y10: 'stone-1',
			x11y11: 'stone-1',
			x12y0: 'terra-1',
			x12y1: 'terra-1',
			x12y2: 'hill-1',
			x12y3: 'forest-2',
			x12y4: 'stone-1',
			x12y5: 'terra-1',
			x12y6: 'road-1',
			x12y7: 'terra-1',
			x12y8: 'terra-1',
			x12y9: 'stone-1',
			x12y10: 'stone-1',
			x12y11: 'stone-1',
			x13y0: 'hill-1',
			x13y1: 'forest-2',
			x13y2: 'forest-1',
			x13y3: 'forest-1',
			x13y4: 'stone-1',
			x13y5: 'stone-1',
			x13y6: 'road-1',
			x13y7: 'road-1',
			x13y8: 'road-1',
			x13y9: 'terra-1',
			x13y10: 'stone-1',
			x13y11: 'forest-1',
			x14y0: 'forest-1',
			x14y1: 'stone-1',
			x14y2: 'forest-2',
			x14y3: 'stone-1',
			x14y4: 'stone-1',
			x14y5: 'forest-2',
			x14y6: 'terra-1',
			x14y7: 'hill-1',
			x14y8: 'road-1',
			x14y9: 'hill-1',
			x14y10: 'forest-2',
			x14y11: 'stone-1',
			x15y0: 'stone-1',
			x15y1: 'stone-1',
			x15y2: 'stone-1',
			x15y3: 'stone-1',
			x15y4: 'hill-1',
			x15y5: 'terra-1',
			x15y6: 'hill-1',
			x15y7: 'terra-1',
			x15y8: 'road-1',
			x15y9: 'hill-1',
			x15y10: 'terra-1',
			x15y11: 'hill-1',
			x16y0: 'stone-1',
			x16y1: 'forest-2',
			x16y2: 'stone-1',
			x16y3: 'forest-1',
			x16y4: 'forest-1',
			x16y5: 'hill-1',
			x16y6: 'stone-1',
			x16y7: 'stone-1',
			x16y8: 'road-1',
			x16y9: 'terra-1',
			x16y10: 'hill-1',
			x16y11: 'terra-1',
			x17y0: 'forest-1',
			x17y1: 'stone-1',
			x17y2: 'forest-1',
			x17y3: 'hill-1',
			x17y4: 'forest-1',
			x17y5: 'stone-1',
			x17y6: 'stone-1',
			x17y7: 'stone-1',
			x17y8: 'road-1',
			x17y9: 'road-1',
			x17y10: 'road-1',
			x17y11: 'road-1',
			x18y0: 'stone-1',
			x18y1: 'stone-1',
			x18y2: 'stone-1',
			x18y3: 'forest-2',
			x18y4: 'stone-1',
			x18y5: 'stone-1',
			x18y6: 'stone-1',
			x18y7: 'stone-1',
			x18y8: 'terra-1',
			x18y9: 'hill-1',
			x18y10: 'forest-2',
			x18y11: 'forest-2',
			x19y0: 'forest-1',
			x19y1: 'stone-1',
			x19y2: 'forest-1',
			x19y3: 'forest-1',
			x19y4: 'stone-1',
			x19y5: 'forest-1',
			x19y6: 'stone-1',
			x19y7: 'forest-2',
			x19y8: 'stone-1',
			x19y9: 'forest-2',
			x19y10: 'forest-1',
			x19y11: 'forest-1'
		}
	};

}(window));