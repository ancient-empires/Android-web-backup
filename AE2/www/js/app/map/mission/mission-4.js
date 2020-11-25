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
			name: 'REINFORCEMENTS',
			objective: 'Protect the Temple of Life - destroy all enemy units, occupy the enemy castle!'
		},
		langRuExtra = {
			name: 'ПОДКРЕПЛЕНИЕ',
			objective: 'Защитить Храм Жизни - уничтожить все вражеские единицы, занять вражеский замок!'
		},
		langEsExtra = {
			name: 'REFUERZOS',
			objective: 'Proteje el Templo de la Vida - ¡Destruye a todas las unidades enemigas, ocupa el castillo enemigo! '
		},
		langZhExtra = {
			name: '筋',
			objective: '保护生命的圣殿 - 摧毁一切敌人，占领敌人的城堡！'
		};

	win.APP.maps.mission_001_004 = {
		version: 10,
		type: 'mission',
		isOpen: false,
		openMaps: [
			{jsMapKey: 'mission_001_005', type: 'mission'}
		],
		size: {width: 16, height: 16},
		maxPlayers: 2,
		unitLimit: 25,
		availableStoreUnits: ['soldier', 'archer', 'elemental', 'sorceress', 'wisp', 'dire-wolf', 'golem', 'catapult'],
		money: [
			{playerId: 0, money: 400},
			{playerId: 1, money: 400}
		],
		win: ['noEnemyUnit', 'allCastles'], // allCastles, noEnemyUnit
		defeat: ['commanderIsDead'], // 'galamarDead', 'valadornDead'

		// en
		name: langEnExtra.name,
		objective: langEnExtra.objective,
		startBriefing: [
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langEn.story.list[3]
				},
				playSound: {
					sound: 'bg-story.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'The Temple of Life'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Your Majesty, thank the Creator you are here! Please help us protect the Crystal!',
					img: 'i/face/tamplier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Only in the heavily guarded fortresses of Thorin will the Crystal be safe. We must deliver it there.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Your Majesty, our scouts report enemy troops nearby!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'They are destroying our buildings to cripple our supply of gold! They must be stopped!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Captain, we must save the Crystal, prepare the troops for battle!',
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
		endBriefing: [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Your Majesty, We have stopped the attack.',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Well done, Captain! Prepare the troops to march to Thorin!',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_005', { type: 'mission' }]
				}
			}
		],

		// es
		'name-es': langEsExtra.name,
		'objective-es': langEsExtra.objective,
		'startBriefing-es': [
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langEs.story.list[3]
				},
				playSound: {
					sound: 'bg-story.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'El Templo de la Vida'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Su Majestad, gracias a dios está aquí! ¡Por favor ayúdenos a proteger el Cristal!',
					img: 'i/face/tamplier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Solamente en las fortalezas de Thorin el Cristal estará a salvo. Debemos llevarlo allí.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Su Majestad, nuestros exploradores reportan tropas enemigas cercanas! ',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Están destruyendo nuestros edificios para mermar nuestro suministro de oro! ¡Deben ser detenidos!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Capitán, tenemos que salvar el Cristal, preparen las tropas para la batalla!',
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
		'endBriefing-es': [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Su Majestad, hemos detenido el ataque.',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Bien hecho, Capitán! ¡Prepare las tropas marcharemos hacia Thorin!',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_005', { type: 'mission' }]
				}
			}
		],

		// ru
		'name-ru': langRuExtra.name,
		'objective-ru': langRuExtra.objective,
		'startBriefing-ru': [
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langRu.story.list[3]
				},
				playSound: {
					sound: 'bg-story.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Храм Жизни'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Ваше Величество, благодаря Создателю вы здесь! Пожалуйста, помогите нам защитить Кристалл!',
					img: 'i/face/tamplier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Только в хорошо защищенных крепостях Торина Кристалл будет в безопасности. Мы должны принести его туда.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Ваше Величество, наши разведчики докладывают, что вражеские войска неподалеку!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Они разрушают наши здания, чтобы нанести ущерб нашим поставкам золота! Она должны быть остановлены!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Капитан, мы должны спасти Кристалл, готовьте войска к битве!',
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
		'endBriefing-ru': [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Ваше величество, мы остановили атаку.',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Хорошая работа, Капитан! Приготовьте войска к маршу в Торин!',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_005', { type: 'mission' }]
				}
			}
		],

		// zh
		'name-zh': langZhExtra.name,
		'objective-zh': langZhExtra.objective,
		'startBriefing-zh': [
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langZh.story.list[3]
				},
				playSound: {
					sound: 'bg-story.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: '生命神殿'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '感谢上帝！你到了！请帮助我们保护水晶！',
					img: 'i/face/tamplier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7 , y: 1 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '只有严密防守才能保护住水晶，我们不能放松警惕.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '长官！我们的探子发现附近有敌方的部队!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '他们正在破坏我们的建筑来切断我们的资金补给！必须阻止他们！',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '长官，我们必须保护水晶，准备战斗吧!',
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
		'endBriefing-zh': [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '感谢上帝，我们保护住了水晶。',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '做得好长官！欢呼胜利吧！',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_005', { type: 'mission' }]
				}
			}
		],

		units: [
			{x: 7, y: 1, type: 'galamar', ownerId: 0},
			{x: 3, y: 3, type: 'sorceress', ownerId: 0},
			{x: 7, y: 5, type: 'elemental', ownerId: 0},
			{x: 5, y: 4, type: 'soldier', ownerId: 0},
			{x: 11, y: 3, type: 'archer', ownerId: 0},
			{x: 12, y: 3, type: 'soldier', ownerId: 0},
			{x: 13, y: 6, type: 'soldier', ownerId: 1},
			{x: 11, y: 7, type: 'dire-wolf', ownerId: 1},
			{x: 13, y: 9, type: 'demon-lord', ownerId: 1},
			{x: 12, y: 9, type: 'catapult', ownerId: 1},
			{x: 5, y: 11, type: 'golem', ownerId: 1},
			{x: 6, y: 10, type: 'catapult', ownerId: 1},
			{x: 9, y: 11, type: 'soldier', ownerId: 1},
			{x: 14, y: 5, type: 'elemental', ownerId: 1}
		],
		buildings: [
			{x: 7, y: 1, type: 'castle', state: 'normal', ownerId: 0},
			{x: 3, y: 3, type: 'temple', state: 'normal'},
			{x: 7, y: 5, type: 'farm', state: 'normal', ownerId: 0},
			{x: 1, y: 8, type: 'farm', state: 'normal', ownerId: 0},
			{x: 5, y: 11, type: 'farm', state: 'normal', ownerId: 1},
			{x: 4, y: 9, type: 'farm', state: 'destroyed'},
			{x: 9, y: 1, type: 'farm', state: 'normal', ownerId: 0},
			{x: 12, y: 3, type: 'farm', state: 'normal', ownerId: 0},
			{x: 13, y: 6, type: 'farm', state: 'normal', ownerId: 1},
			{x: 13, y: 9, type: 'castle', state: 'normal', ownerId: 1},
			{x: 9, y: 11, type: 'farm', state: 'normal', ownerId: 1},
			{x: 14, y: 11, type: 'farm', state: 'normal', ownerId: 1},
			{x: 12, y: 13, type: 'farm', state: 'normal', ownerId: 1},
			{x: 5, y: 4, type: 'farm', state: 'normal', ownerId: 0}
		],
		terrain: {
			x0y0: 'stone-1',
			x0y1: 'stone-1',
			x0y2: 'forest-1',
			x0y3: 'stone-1',
			x0y4: 'hill-1',
			x0y5: 'road-1',
			x1y0: 'stone-1',
			x1y1: 'forest-2',
			x1y2: 'hill-1',
			x1y3: 'forest-1',
			x1y4: 'forest-1',
			x1y5: 'road-1',
			x2y0: 'stone-1',
			x2y1: 'forest-2',
			x2y2: 'forest-1',
			x2y3: 'terra-1',
			x2y4: 'hill-1',
			x2y5: 'road-1',
			x3y0: 'forest-1',
			x3y1: 'stone-1',
			x3y2: 'terra-1',
			x3y3: 'terra-1',
			x3y4: 'road-1',
			x3y5: 'road-1',
			x4y0: 'stone-1',
			x4y1: 'forest-2',
			x4y2: 'stone-1',
			x4y3: 'terra-1',
			x4y4: 'hill-1',
			x4y5: 'road-1',
			x5y0: 'forest-1',
			x5y1: 'hill-1',
			x5y2: 'forest-1',
			x5y3: 'stone-1',
			x5y4: 'terra-1',
			x5y5: 'road-1',
			x6y0: 'forest-1',
			x6y1: 'terra-1',
			x6y2: 'terra-1',
			x6y3: 'stone-1',
			x6y4: 'forest-1',
			x6y5: 'forest-2',
			x7y0: 'stone-1',
			x7y1: 'terra-1',
			x7y2: 'road-1',
			x7y3: 'forest-1',
			x7y4: 'forest-2',
			x7y5: 'terra-1',
			x8y0: 'road-1',
			x8y1: 'road-1',
			x8y2: 'road-1',
			x8y3: 'road-1',
			x8y4: 'road-1',
			x8y5: 'road-1',
			x9y0: 'forest-2',
			x9y1: 'terra-1',
			x9y2: 'road-1',
			x9y3: 'forest-2',
			x9y4: 'terra-1',
			x9y5: 'hill-1',
			x10y0: 'stone-1',
			x10y1: 'forest-2',
			x10y2: 'road-1',
			x10y3: 'stone-1',
			x10y4: 'forest-1',
			x10y5: 'forest-1',
			x11y0: 'forest-1',
			x11y1: 'hill-1',
			x11y2: 'road-1',
			x11y3: 'hill-1',
			x11y4: 'forest-1',
			x11y5: 'stone-1',
			x12y0: 'forest-1',
			x12y1: 'hill-1',
			x12y2: 'road-1',
			x12y3: 'terra-1',
			x12y4: 'water-1',
			x12y5: 'water-1',
			x13y0: 'forest-1',
			x13y1: 'road-1',
			x13y2: 'road-1',
			x13y3: 'stone-1',
			x13y4: 'water-1',
			x13y5: 'water-1',
			x14y0: 'stone-1',
			x14y1: 'road-1',
			x14y2: 'hill-1',
			x14y3: 'water-1',
			x14y4: 'water-1',
			x14y5: 'water-1',
			x0y6: 'stone-1',
			x1y6: 'stone-1',
			x2y6: 'forest-1',
			x3y6: 'road-1',
			x4y6: 'forest-2',
			x5y6: 'road-1',
			x6y6: 'road-1',
			x7y6: 'road-1',
			x8y6: 'road-1',
			x9y6: 'stone-1',
			x10y6: 'terra-1',
			x11y6: 'forest-1',
			x12y6: 'stone-1',
			x13y6: 'terra-1',
			x14y6: 'forest-1',
			x0y7: 'forest-1',
			x1y7: 'terra-1',
			x2y7: 'hill-1',
			x3y7: 'road-1',
			x4y7: 'forest-1',
			x5y7: 'forest-2',
			x6y7: 'hill-1',
			x7y7: 'stone-1',
			x8y7: 'water-1',
			x9y7: 'water-1',
			x10y7: 'forest-2',
			x11y7: 'forest-1',
			x12y7: 'forest-2',
			x13y7: 'hill-1',
			x14y7: 'forest-1',
			x0y8: 'stone-1',
			x1y8: 'terra-1',
			x2y8: 'terra-1',
			x3y8: 'road-1',
			x4y8: 'stone-1',
			x5y8: 'stone-1',
			x6y8: 'forest-2',
			x7y8: 'water-1',
			x8y8: 'water-1',
			x9y8: 'water-1',
			x10y8: 'stone-1',
			x11y8: 'terra-1',
			x12y8: 'terra-1',
			x13y8: 'terra-1',
			x14y8: 'stone-1',
			x0y9: 'hill-1',
			x1y9: 'stone-1',
			x2y9: 'forest-1',
			x3y9: 'road-1',
			x4y9: 'terra-1',
			x5y9: 'terra-1',
			x6y9: 'stone-1',
			x7y9: 'water-1',
			x8y9: 'water-1',
			x9y9: 'water-1',
			x10y9: 'forest-2',
			x11y9: 'terra-1',
			x12y9: 'hill-1',
			x13y9: 'terra-1',
			x14y9: 'terra-1',
			x0y10: 'forest-1',
			x1y10: 'forest-2',
			x2y10: 'terra-1',
			x3y10: 'road-1',
			x4y10: 'road-1',
			x5y10: 'road-1',
			x6y10: 'road-1',
			x7y10: 'bridge-1',
			x8y10: 'bridge-1',
			x9y10: 'road-1',
			x10y10: 'road-1',
			x11y10: 'road-1',
			x12y10: 'road-1',
			x13y10: 'road-1',
			x14y10: 'road-1',
			x0y11: 'stone-1',
			x1y11: 'forest-2',
			x2y11: 'hill-1',
			x3y11: 'hill-1',
			x4y11: 'terra-1',
			x5y11: 'terra-1',
			x6y11: 'hill-1',
			x7y11: 'water-1',
			x8y11: 'water-1',
			x9y11: 'terra-1',
			x10y11: 'terra-1',
			x11y11: 'hill-1',
			x12y11: 'forest-1',
			x13y11: 'road-1',
			x14y11: 'terra-1',
			x0y12: 'forest-1',
			x1y12: 'forest-1',
			x2y12: 'forest-1',
			x3y12: 'stone-1',
			x4y12: 'forest-1',
			x5y12: 'terra-1',
			x6y12: 'forest-1',
			x7y12: 'water-1',
			x8y12: 'water-1',
			x9y12: 'forest-1',
			x10y12: 'stone-1',
			x11y12: 'terra-1',
			x12y12: 'terra-1',
			x13y12: 'road-1',
			x14y12: 'forest-2',
			x15y0: 'forest-1',
			x15y1: 'road-1',
			x15y2: 'stone-1',
			x15y3: 'water-1',
			x15y4: 'water-2',
			x15y5: 'water-1',
			x15y6: 'water-1',
			x15y7: 'forest-1',
			x15y8: 'road-1',
			x15y9: 'road-1',
			x15y10: 'road-1',
			x15y11: 'stone-1',
			x15y12: 'forest-2',
			x0y13: 'water-1',
			x1y13: 'water-1',
			x2y13: 'water-1',
			x3y13: 'stone-1',
			x4y13: 'hill-1',
			x5y13: 'forest-1',
			x6y13: 'water-1',
			x7y13: 'water-1',
			x8y13: 'water-1',
			x9y13: 'stone-1',
			x10y13: 'terra-1',
			x11y13: 'terra-1',
			x12y13: 'terra-1',
			x13y13: 'road-1',
			x14y13: 'road-1',
			x15y13: 'forest-1',
			x0y14: 'water-3',
			x1y14: 'water-1',
			x2y14: 'water-1',
			x3y14: 'forest-2',
			x4y14: 'stone-1',
			x5y14: 'water-1',
			x6y14: 'water-1',
			x7y14: 'water-1',
			x8y14: 'water-1',
			x9y14: 'hill-1',
			x10y14: 'forest-2',
			x11y14: 'hill-1',
			x12y14: 'stone-1',
			x13y14: 'terra-1',
			x14y14: 'road-1',
			x15y14: 'forest-1',
			x0y15: 'water-1',
			x1y15: 'water-2',
			x2y15: 'water-1',
			x3y15: 'water-1',
			x4y15: 'water-1',
			x5y15: 'water-1',
			x6y15: 'water-3',
			x7y15: 'water-1',
			x8y15: 'hill-1',
			x9y15: 'forest-1',
			x10y15: 'forest-1',
			x11y15: 'forest-1',
			x12y15: 'forest-2',
			x13y15: 'hill-1',
			x14y15: 'road-1',
			x15y15: 'forest-2'
		}
	};

}(window));