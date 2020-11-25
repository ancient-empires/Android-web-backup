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
			name: 'TO THE RESCUE',
			objective: 'Destroy all attacking enemy troops, occupy both castles.'
		},
		langRuExtra = {
			name: 'К СПАСЕНИЮ',
			objective: 'Уничтожить все вражеские войска, занять оба замка.'
		},
		langEsExtra = {
			name: 'AL RESCATE',
			objective: 'Destruye a todas las tropas enemigas, ocupa ambos castillos.'
		},
		langZhExtra = {
			name: '拯救',
			objective: '摧毁所有地方部队，占领所有城堡.'
		};

	win.APP.maps.mission_001_002 = {
		version: 10,
		type: 'mission',
		isOpen: false,
		openMaps: [
			{jsMapKey: 'mission_001_003', type: 'mission'}
		],
		size: {width: 15, height: 12},
		maxPlayers: 2,
		unitLimit: 25,
		availableStoreUnits: ['soldier', 'archer'],
		money: [
			{playerId: 0, money: 300},
			{playerId: 1, money: 300}
		],
		win: ['noEnemyUnit', 'allCastles'], // allCastles, noEnemyUnit
		defeat: ['commanderIsDead'], // 'galamarDead', 'valadornDead'

		// en
		name: langEnExtra.name,
		objective: langEnExtra.objective,
		help: [
			langEn.helpList[2],
			langEn.helpList[3]
		],
		startBriefing: [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'The Temple of Wisdom'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'How can this be? The Temple of Wisdom is also under attack!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Well, well... Valadorn, I presume? Prepare to be defeated!',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 12, y: 3 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Sir, a part of the enemy force is retreating!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 10 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'The Crystal of Wisdom! Do not let them escape!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Sir, we must follow them!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Let us stop this attack first. The temple guards will not stand a chance otherwise!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Let us make our stand at this castle!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 3 , y: 5 }]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEnExtra.name,
					text: langEnExtra.objective
				},
				onHide: {
					fn: 'autoShowHelpButton'
				}
			}
		],
		endBriefing: [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Well done, Captain. But there is no time to rest. The Crystal of Life may also be in danger. We must warn King Galamar!',
					img: 'i/face/valadorn.png'
				}
			},			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Yes, Sir. I will ready the troops.',
					img: 'i/face/soldier.png'
				}
			},
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
					args: ['mission_001_003', { type: 'mission' }]
				}
			}
		],


		// es
		'name-es': langEsExtra.name,
		'objective-es': langEsExtra.objective,
		'help-es': [
			langEs.helpList[2],
			langEs.helpList[3]
		],
		'startBriefing-es': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'El Templo de la Sabiduría.'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¿Cómo es esto posible? El Templo de la Sabiduría también está siendo atacado.',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Bien, bien... ¿Valador, supongo? Preparate para ser derrotado.',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 12, y: 3 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Señor, una parte de las fuerzas enemigas está retirandose!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 10 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡El Cristal de la Sabiduría! ¡No los dejen escapar!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Mi señor, debemos seguirlos!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Detengamos el ataque primero. De otra manera los guardias del templo no tendrán oportunidad!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Hagamos nuestra base en ese castillo.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 3 , y: 5 }]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEsExtra.name,
					text: langEsExtra.objective
				},
				onHide: {
					fn: 'autoShowHelpButton'
				}
			}
		],
		'endBriefing-es': [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Bien hecho Capitán. Pero no hay tiempo para descansar. El Cristal de la VIda puede estar en peligro. ¡Debemos advertir al rey Galamar!',
					img: 'i/face/valadorn.png'
				}
			},			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Si señor. Prepararé a las tropas.',
					img: 'i/face/soldier.png'
				}
			},
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
					args: ['mission_001_003', { type: 'mission' }]
				}
			}
		],

		// ru
		'name-ru': langRuExtra.name,
		'objective-ru': langRuExtra.objective,
		'help-ru': [
			langRu.helpList[2],
			langRu.helpList[3]
		],
		'startBriefing-ru': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Храм Мудрости'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Как это может быть? Храм Мудрости тоже атакован!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Так, так... Валадорн, предполагаю? Приготовься к поражению!',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 12, y: 3 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Сэр, часть вражеских сил отступает!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 10 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Кристалл Мудрости! Не дайте им уйти!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Сэр, мы должны преследовать их!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Давайте сначала остановим атаку. Охрана храма не даст другого шанса!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Давайте разобьем лагерь в том замке!',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 3 , y: 5 }]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langRuExtra.name,
					text: langRuExtra.objective
				},
				onHide: {
					fn: 'autoShowHelpButton'
				}
			}
		],
		'endBriefing-ru': [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Хорошая работа, Капитан. Но у нас нет времени на отдых. Кристалл Жизни все еще в опасности. Мы должны предупредить Короля Галамара!',
					img: 'i/face/valadorn.png'
				}
			},			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Да, Сэр. Я приготовлю войска.',
					img: 'i/face/soldier.png'
				}
			},
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
					args: ['mission_001_003', { type: 'mission' }]
				}
			}
		],

		// zh
		'name-zh': langZhExtra.name,
		'objective-zh': langZhExtra.objective,
		'help-zh': [
			langZh.helpList[2],
			langZh.helpList[3]
		],
		'startBriefing-zh': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: '智慧神殿'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '这怎么可能？智慧神殿正在被攻击！',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '很好，很好..是渥拉顿吗？准备好被我击败吧!',
					img: 'i/face/demon-lord.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 12, y: 3 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '报告！我们发现了一小股地方部队正在接近！',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 10 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '智慧水晶！不要让他们跑了！',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '先生，我们必须追上去！',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '让我们先击退对神殿的进攻吧，神殿已经支撑不了多久了。',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 9 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '让我们以这个城堡为根基吧',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 3 , y: 5 }]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langZhExtra.name,
					text: langZhExtra.objective
				},
				onHide: {
					fn: 'autoShowHelpButton'
				}
			}
		],
		'endBriefing-zh': [
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '做得好！长官！但是恐怕我们没有时间休息了，生命水晶可能也有危险，我们必须赶紧通知国王格拉玛！',
					img: 'i/face/valadorn.png'
				}
			},			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '好的，先生，我会让军队做好准备的',
					img: 'i/face/soldier.png'
				}
			},
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
					args: ['mission_001_003', { type: 'mission' }]
				}
			}
		],

		units: [
			{x: 8, y: 9, type: 'valadorn', ownerId: 0},
			{x: 9, y: 10, type: 'archer', ownerId: 0},
			{x: 7, y: 10, type: 'soldier', ownerId: 0},
			{x: 12, y: 3, type: 'demon-lord', ownerId: 1},
			{x: 13, y: 4, type: 'archer', ownerId: 1},
			{x: 6, y: 1, type: 'soldier', ownerId: 1}
		],
		buildings: [
			{x: 7, y: 3, type: 'temple', state: 'normal'},
			{x: 3, y: 5, type: 'castle', state: 'normal'},
			{x: 1, y: 4, type: 'farm', state: 'normal'},
			{x: 5, y: 2, type: 'farm', state: 'normal'},
			{x: 5, y: 7, type: 'farm', state: 'destroyed'},
			{x: 7,y: 7,type: 'farm', state: 'normal'},
			{x: 10, y: 2, type: 'farm', state: 'normal'},
			{x: 9, y: 5, type: 'farm', state: 'destroyed'},
			{x: 13, y: 6, type: 'farm', state: 'normal'},
			{x: 12, y: 3, type: 'castle', state: 'normal'}
		],
		terrain: {
			x0y0: 'water-1',
			x0y1: 'hill-1',
			x0y2: 'forest-1',
			x0y3: 'forest-2',
			x0y4: 'stone-1',
			x0y5: 'forest-2',
			x1y0: 'water-1',
			x1y1: 'water-1',
			x1y2: 'forest-2',
			x1y3: 'stone-1',
			x1y4: 'terra-1',
			x1y5: 'hill-1',
			x2y0: 'water-3',
			x2y1: 'water-1',
			x2y2: 'water-1',
			x2y3: 'forest-1',
			x2y4: 'hill-1',
			x2y5: 'terra-1',
			x3y0: 'water-1',
			x3y1: 'water-1',
			x3y2: 'water-1',
			x3y3: 'stone-1',
			x3y4: 'terra-1',
			x3y5: 'terra-1',
			x4y0: 'water-1',
			x4y1: 'water-1',
			x4y2: 'stone-1',
			x4y3: 'forest-2',
			x4y4: 'terra-1',
			x4y5: 'hill-1',
			x5y0: 'water-1',
			x5y1: 'water-1',
			x5y2: 'terra-1',
			x5y3: 'stone-1',
			x5y4: 'forest-1',
			x5y5: 'terra-1',
			x6y0: 'bridge-2',
			x6y1: 'bridge-2',
			x6y2: 'road-1',
			x6y3: 'road-1',
			x6y4: 'road-1',
			x6y5: 'stone-1',
			x7y0: 'water-1',
			x7y1: 'water-1',
			x7y2: 'forest-1',
			x7y3: 'terra-1',
			x7y4: 'road-1',
			x7y5: 'road-1',
			x8y0: 'water-3',
			x8y1: 'water-1',
			x8y2: 'water-1',
			x8y3: 'stone-1',
			x8y4: 'road-1',
			x8y5: 'forest-2',
			x9y0: 'water-1',
			x9y1: 'water-1',
			x9y2: 'water-1',
			x9y3: 'hill-1',
			x9y4: 'road-1',
			x9y5: 'terra-1',
			x0y6: 'road-1',
			x1y6: 'road-1',
			x2y6: 'road-1',
			x3y6: 'road-1',
			x4y6: 'road-1',
			x5y6: 'road-1',
			x6y6: 'road-1',
			x7y6: 'road-1',
			x8y6: 'hill-1',
			x9y6: 'stone-1',
			x0y7: 'forest-2',
			x1y7: 'forest-1',
			x2y7: 'hill-1',
			x3y7: 'road-1',
			x4y7: 'hill-1',
			x5y7: 'terra-1',
			x6y7: 'forest-1',
			x7y7: 'terra-1',
			x8y7: 'hill-1',
			x9y7: 'terra-1',
			x0y8: 'hill-1',
			x1y8: 'stone-1',
			x2y8: 'terra-1',
			x3y8: 'road-1',
			x4y8: 'road-1',
			x5y8: 'road-1',
			x6y8: 'hill-1',
			x7y8: 'forest-2',
			x8y8: 'terra-1',
			x9y8: 'stone-1',
			x0y9: 'stone-1',
			x1y9: 'forest-2',
			x2y9: 'hill-1',
			x3y9: 'terra-1',
			x4y9: 'forest-1',
			x5y9: 'road-1',
			x6y9: 'road-1',
			x7y9: 'road-1',
			x8y9: 'road-1',
			x9y9: 'hill-1',
			x0y10: 'forest-2',
			x1y10: 'forest-1',
			x2y10: 'forest-1',
			x3y10: 'stone-1',
			x4y10: 'hill-1',
			x5y10: 'terra-1',
			x6y10: 'hill-1',
			x7y10: 'terra-1',
			x8y10: 'road-1',
			x9y10: 'terra-1',
			x0y11: 'terra-4',
			x1y11: 'forest-2',
			x2y11: 'stone-1',
			x3y11: 'stone-1',
			x4y11: 'forest-2',
			x5y11: 'stone-1',
			x6y11: 'forest-2',
			x7y11: 'hill-1',
			x8y11: 'road-1',
			x9y11: 'forest-1',
			x10y0: 'water-1',
			x10y1: 'water-1',
			x10y2: 'terra-1',
			x10y3: 'forest-1',
			x10y4: 'road-1',
			x10y5: 'road-1',
			x10y6: 'forest-2',
			x10y7: 'water-1',
			x10y8: 'water-1',
			x10y9: 'water-1',
			x10y10: 'hill-1',
			x10y11: 'water-1',
			x11y0: 'water-1',
			x11y1: 'forest-1',
			x11y2: 'forest-2',
			x11y3: 'stone-1',
			x11y4: 'hill-1',
			x11y5: 'road-1',
			x11y6: 'forest-1',
			x11y7: 'water-1',
			x11y8: 'water-1',
			x11y9: 'water-1',
			x11y10: 'water-1',
			x11y11: 'water-1',
			x12y0: 'water-1',
			x12y1: 'forest-2',
			x12y2: 'stone-1',
			x12y3: 'terra-1',
			x12y4: 'terra-1',
			x12y5: 'road-1',
			x12y6: 'hill-1',
			x12y7: 'terra-1',
			x12y8: 'water-1',
			x12y9: 'water-1',
			x12y10: 'water-1',
			x12y11: 'water-1',
			x13y0: 'water-1',
			x13y1: 'terra-1',
			x13y2: 'hill-1',
			x13y3: 'terra-1',
			x13y4: 'stone-1',
			x13y5: 'road-1',
			x13y6: 'terra-1',
			x13y7: 'forest-1',
			x13y8: 'water-1',
			x13y9: 'water-1',
			x13y10: 'water-1',
			x13y11: 'water-1',
			x14y0: 'water-1',
			x14y1: 'forest-2',
			x14y2: 'forest-2',
			x14y3: 'terra-2',
			x14y4: 'hill-1',
			x14y5: 'road-1',
			x14y6: 'forest-1',
			x14y7: 'stone-1',
			x14y8: 'forest-2',
			x14y9: 'hill-1',
			x14y10: 'water-1',
			x14y11: 'water-1'
		}
	};

}(window));