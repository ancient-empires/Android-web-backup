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
			name: 'PATH OF SHADOWS',
			objective: 'Navigate safely through the forest. Destroy all opposition. King Galamar must survive.'
		},
		langRuExtra = {
			name: 'ПУТЬ ТЕНЕЙ',
			objective: 'Проследовать через лес. Уничтожить все сопротивление. Король Галамар должен выжить.'
		},
		langEsExtra = {
			name: 'CAMINO DE SOMBRAS',
			objective: 'Pasa através del bosque con seguridad. Destruye toda resistencia. El rey Galamar debe sobrevivir.'
		},
		langZhExtra = {
			name: '阴影之路',
			objective: '小心翼翼地穿过森林，击败所有的单位，格拉玛必须存活。'
		};

	win.APP.maps.mission_001_003 = {
		version: 10,
		type: 'mission',
		isOpen: false,
		openMaps: [
			{jsMapKey: 'mission_001_004', type: 'mission' }
		],
		size: {width: 10, height: 17},
		maxPlayers: 2,
		unitLimit: 25,
		win: ['noEnemyUnit'], // allCastles, noEnemyUnit
		defeat: ['commanderIsDead'], // 'galamarDead', 'valadornDead'

		// en
		name: langEnExtra.name,
		objective: langEnExtra.objective,
		help: [
			langEn.helpList[4]
		],
		startBriefing: [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Forest of Mists'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Your Majesty, this forest is known to be home of spirits, Elementals, and other magical creatures. Travelling at night is not safe.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8 , y: 14 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Captain, you heard Valadorn\'s messenger - we must press on! Nothing must stand between us and the Temple of Life.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Understood. Troops, keep your eyes open and protect King Galamar!',
					img: 'i/face/soldier.png'
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
		n1Briefing: [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'More wolves! Your Majesty, this does not look good...',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 1, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'By the Creator! What are those things!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Greetings, men of Thorin! We, the Elementals, have heard of your quest to protect our lands from evil and offer our allegiance to our King.'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 4, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'We gladly accept your offer. Your loyalty to the kingdom shall not be forgotten.',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_004', { type: 'mission' }]
				}
			}
		],


		// es
		'name-es': langEsExtra.name,
		'objective-es': langEsExtra.objective,
		'help-es': [
			langEs.helpList[4]
		],
		'startBriefing-es': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Bosque de Niebla.'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Su Majestad, este bosque es conocido por ser el hogar de espíritus, Elementales, y otras mágicas criaturas. No es seguro viajar de noche.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8 , y: 14 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Capitán, escuchó al mensajero de Valador - ¡Debemos avanzar! Nada puede detenernos para llegar a El Templo de la Vida.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Entendido. ¡Tropas, manténganse alerta y protejan al Rey Galamar!',
					img: 'i/face/soldier.png'
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
		'n1Briefing-es': [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Más lobos! Su Majestad ésto no se ve bien...',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 1, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Por el creador! ¡¿Qué son esas cosas?!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Saludos, hombres de Thorin! Nosotros, Los Elementales, hemos oido acerca de su búsqueda para proteger nuestras tierras de la maldad y les ofrecemos nuestra alianza a su Rey.'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 4, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Aceptamos su oferta alegremente. Su lealtad al reino no será olvidada.',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_004', { type: 'mission' }]
				}
			}
		],

		// ru
		'name-ru': langRuExtra.name,
		'objective-ru': langRuExtra.objective,
		'help-ru': [
			langRu.helpList[4]
		],
		'startBriefing-ru': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: 'Лес Мистов'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Ваше величество, лес известен как обитель духов, элементалов, и других магических созданий. Путешествовать по нему ночью небезопасно.',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8 , y: 14 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Капитан, вы слышали посланника от Валадорна - мы должны поднажать! Ничего не должно стоять между нами и Храмом Жизни.',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Понял. Войска, держите глаза открытыми и защитите Короля Галамара!',
					img: 'i/face/soldier.png'
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
		'n1Briefing-ru': [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Еще волки! Ваше величество, это выглядит плохо...',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 1, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Именем Создателя! Что это такое!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Здраствуйте, люди Торина! Мы, Элементалы, слышали  о вашем задании по защите наших земель от зла, и предлагаем нашу верность нашему Королю.'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 4, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Мы рады принять ваше предложение. Ваша преданность королевству не будет забыта.',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_004', { type: 'mission' }]
				}
			}
		],

		// zh
		'name-zh': langZhExtra.name,
		'objective-zh': langZhExtra.objective,
		'help-zh': [
			langZh.helpList[4]
		],
		'startBriefing-zh': [
			{
				popupName: 'simple-notification',
				popupData: {
					header: '迷雾森林'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '尊敬的长官，这个森林是魔法生物的巢穴，在夜晚通过并不安全啊。',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8 , y: 14 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '长官，您已经收到渥拉顿的消息了——我们不能停下！必须到达生命神殿！',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '明白了。士兵们！打起精神，保护好国王！',
					img: 'i/face/soldier.png'
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
		'n1Briefing-zh': [
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '更多的狼..看上去情况不妙。',
					img: 'i/face/soldier.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 1, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '天啊！这是什么生物！',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '您好，尊敬的先生。我们是水元素，是来帮助你们的。'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 4, y: 8}]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '非常感谢你们的帮助，这份恩情我们绝不会忘记。',
					img: 'i/face/galamar.png'
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
					args: ['mission_001_004', { type: 'mission' }]
				}
			}
		],

		cases: [
			{
				isDone: false,
				detect: 'noEnemyUnit',
				do: ['appendUnits', 'showBriefing'],
				units: [
					{
						type: 'elemental',
						ownerId: 0,
						x: 3,
						y: 8
					},
					{
						type: 'elemental',
						ownerId: 0,
						x: 4,
						y: 7
					},
					{
						type: 'elemental',
						ownerId: 0,
						x: 5,
						y: 8
					},

					{
						type: 'wisp',
						ownerId: 1,
						x: 2,
						y: 1
					},

					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 1,
						y: 2
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 3,
						y: 2
					},

					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 0,
						y: 8
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 1,
						y: 7
					},
					{
						type: 'dire-wolf',
						ownerId: 1,
						x: 8,
						y: 6
					}

				],
				briefingName: 'n1Briefing'
			}
		],

		units: [
			{x: 7, y: 14, type: 'soldier', ownerId: 0},
			{x: 8, y: 14, type: 'galamar', ownerId: 0},
			{x: 7, y: 15, type: 'archer', ownerId: 0},
			{x: 8, y: 15, type: 'sorceress', ownerId: 0},
			{x: 6, y: 13, type: 'dire-wolf', ownerId: 1},
			{x: 8, y: 11, type: 'dire-wolf', ownerId: 1}
		],
		buildings: [
			{x: 4, y: 8, type: 'well', state: 'normal'}
		],
		terrain: {
			x0y0: 'forest-1',
			x0y1: 'forest-1',
			x0y2: 'stone-1',
			x0y3: 'water-1',
			x0y4: 'water-1',
			x0y5: 'forest-2',
			x1y0: 'stone-1',
			x1y1: 'forest-1',
			x1y2: 'hill-1',
			x1y3: 'terra-1',
			x1y4: 'terra-1',
			x1y5: 'terra-1',
			x2y0: 'road-1',
			x2y1: 'road-1',
			x2y2: 'road-1',
			x2y3: 'road-1',
			x2y4: 'road-1',
			x2y5: 'forest-1',
			x3y0: 'terra-1',
			x3y1: 'forest-2',
			x3y2: 'hill-1',
			x3y3: 'forest-2',
			x3y4: 'road-1',
			x3y5: 'forest-2',
			x4y0: 'stone-1',
			x4y1: 'forest-1',
			x4y2: 'forest-1',
			x4y3: 'stone-1',
			x4y4: 'road-1',
			x4y5: 'terra-1',
			x5y0: 'water-1',
			x5y1: 'water-1',
			x5y2: 'water-1',
			x5y3: 'hill-1',
			x5y4: 'road-1',
			x5y5: 'stone-1',
			x6y0: 'water-1',
			x6y1: 'water-2',
			x6y2: 'water-1',
			x6y3: 'forest-1',
			x6y4: 'road-1',
			x6y5: 'forest-1',
			x7y0: 'water-3',
			x7y1: 'water-1',
			x7y2: 'water-1',
			x7y3: 'forest-2',
			x7y4: 'road-1',
			x7y5: 'road-1',
			x8y0: 'water-1',
			x8y1: 'water-1',
			x8y2: 'water-1',
			x8y3: 'forest-1',
			x8y4: 'terra-1',
			x8y5: 'forest-2',
			x9y0: 'water-1',
			x9y1: 'water-3',
			x9y2: 'water-1',
			x9y3: 'water-1',
			x9y4: 'water-1',
			x9y5: 'water-1',
			x0y6: 'forest-1',
			x1y6: 'hill-1',
			x2y6: 'water-1',
			x3y6: 'water-1',
			x4y6: 'water-1',
			x5y6: 'water-1',
			x6y6: 'water-1',
			x7y6: 'road-1',
			x8y6: 'hill-1',
			x9y6: 'forest-1',
			x0y7: 'hill-1',
			x1y7: 'terra-1',
			x2y7: 'water-1',
			x3y7: 'water-1',
			x4y7: 'water-1',
			x5y7: 'water-1',
			x6y7: 'water-1',
			x7y7: 'bridge-2',
			x8y7: 'water-1',
			x9y7: 'water-1',
			x0y8: 'forest-1',
			x1y8: 'terra-1',
			x2y8: 'water-1',
			x3y8: 'water-1',
			x4y8: 'terra-1',
			x5y8: 'water-1',
			x6y8: 'water-1',
			x7y8: 'bridge-2',
			x8y8: 'water-1',
			x9y8: 'water-1',
			x0y9: 'water-1',
			x1y9: 'bridge-2',
			x2y9: 'water-1',
			x3y9: 'water-1',
			x4y9: 'bridge-2',
			x5y9: 'water-1',
			x6y9: 'water-1',
			x7y9: 'road-1',
			x8y9: 'forest-1',
			x9y9: 'water-1',
			x0y10: 'water-1',
			x1y10: 'bridge-2',
			x2y10: 'water-1',
			x3y10: 'water-1',
			x4y10: 'bridge-2',
			x5y10: 'water-1',
			x6y10: 'water-1',
			x7y10: 'road-1',
			x8y10: 'stone-1',
			x9y10: 'stone-1',
			x0y11: 'forest-2',
			x1y11: 'hill-1',
			x2y11: 'forest-2',
			x3y11: 'terra-1',
			x4y11: 'road-1',
			x5y11: 'hill-1',
			x6y11: 'forest-1',
			x7y11: 'road-1',
			x8y11: 'forest-1',
			x9y11: 'stone-1',
			x0y12: 'forest-2',
			x1y12: 'forest-1',
			x2y12: 'terra-1',
			x3y12: 'hill-1',
			x4y12: 'road-1',
			x5y12: 'road-1',
			x6y12: 'road-1',
			x7y12: 'road-1',
			x8y12: 'road-1',
			x9y12: 'road-1',
			x0y13: 'forest-1',
			x1y13: 'stone-1',
			x2y13: 'hill-1',
			x3y13: 'terra-1',
			x4y13: 'forest-2',
			x5y13: 'forest-1',
			x6y13: 'stone-1',
			x7y13: 'road-1',
			x8y13: 'hill-1',
			x9y13: 'forest-2',
			x0y14: 'water-1',
			x1y14: 'water-1',
			x2y14: 'water-1',
			x3y14: 'forest-1',
			x4y14: 'stone-1',
			x5y14: 'forest-1',
			x6y14: 'forest-1',
			x7y14: 'road-1',
			x8y14: 'road-1',
			x9y14: 'forest-1',
			x0y15: 'water-2',
			x1y15: 'water-1',
			x2y15: 'water-1',
			x3y15: 'forest-1',
			x4y15: 'hill-1',
			x5y15: 'forest-1',
			x6y15: 'hill-1',
			x7y15: 'terra-1',
			x8y15: 'road-1',
			x9y15: 'forest-1',
			x0y16: 'water-1',
			x1y16: 'water-1',
			x2y16: 'forest-1',
			x3y16: 'forest-2',
			x4y16: 'water-1',
			x5y16: 'water-1',
			x6y16: 'forest-1',
			x7y16: 'forest-1',
			x8y16: 'road-1',
			x9y16: 'hill-1'
		}
	};

}(window));