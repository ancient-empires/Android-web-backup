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
			name: 'HEAVEN\'S FURY',
			objective: 'Defeat Saeth and his minions! Galamar and Valadorn must survive.'
		},
		langRuExtra = {
			name: 'ЯРОСТЬ НЕБЕС',
			objective: 'Порвать Саефа и его приспешников! Король Галамар и Король Валадорн должны выжить.'
		},
		langEsExtra = {
			name: 'LA FURIA DE LOS CIELOS',
			objective: '¡Derrota a Saeth y a sus adeptos! Galamar y Valador deben sobrevivir.'
		},
		langZhExtra = {
			name: '天堂之怒',
			objective: '击败西斯和他的生物！格拉玛与渥拉顿必须存活。'
		};
		

	win.APP.maps.mission_001_008 = {
		version: 10,
		type: 'mission',
		isOpen: false,
		//openMaps: [],
		size: {width: 14, height: 18},
		maxPlayers: 2,
		unitLimit: 25,
		money: [
			{playerId: 0, money: 900}, // default {playerId: 0, money: 900}
			{playerId: 1, money: 600}
		],
		win: ['noEnemyUnit'], // allCastles, noEnemyUnit, allUnorderedCasesIsDone
		defeat: ['commanderIsDead'], // 'galamarDead', 'valadornDead', crystalIsDead

		// en
		name: langEnExtra.name,
		objective: langEnExtra.objective,
		startBriefing: [
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langEn.story.list[4]
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
					header: 'The Ancient Citadel'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'The Ruins of the Ancient Citadel... and Saeth! With the Crystals!',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'At last, Galamar and Valadorn! How very brave of you to confront me! All the keys are now in place, and soon the greatest power ever created on this earth will roar and bend to my will. Your destruction will be testimony to its might and glory!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Your ruses can no longer fool us, Saeth!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right ta-center',
				cssClass: 'briefing',
				popupData: {
					text: 'TARGET AQUIRED...<br>HEAVEN\'S FURY ACTIVATED!',
					img: ''
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Heaven\'s Fury? What in the name of the Creator is that!',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Pathetic creatures, this is something ancient that you would not understand even if you lived a thousand years! Witness the power of Heaven\'s Fury!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Galamar! We must hurry if our troops are to stand a chance!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Sire, we should attack these castles first before we launch an attack on the Saeth and the Ruins.',
					img: 'i/face/soldier.png'
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
				playSound: {
					sound: 'game-complete.mp3',
					road: 0,
					isLoop: true
				},
				popupData: {
					text: 'Pitiful wretches. You will not live long enough to see your precious Kingdom engulfed in shadow...',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Saeth! This time your defeat is complete!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'In your insignificant life and narrow mind, perhaps... Nevertheless everything is now set in motion - the invisible forces that govern time are beyond your knowledge. You cannot stop me from rising again!',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Your Majesty, the Ruins are falling apart! We should leave immediately!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'But the Crystals... They are still in there!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'The only thing we can save now is ourselves!',
					img: 'i/face/valadorn.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'You have served me well. Now move!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langEn.story.list[5]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEn.missionComplete
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEn.congratulations,
					text: 'And thank you for playing AE2 - I very much hope you enjoyed playing it as much as I enjoyed making it!'
				},
				onHide: {
					fn: 'backTo',
					args: ['', { isForce: true }]
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
					content: langEs.story.list[4]
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
					header: 'La Antigua Citadela'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Las Ruinas de la Antigua Citadela... y Saeth! ¡Con los Cristales!',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Al fin, Galamar y Valador! ¡Vaya si son valientes para atreverse a enfrentarme! Todas las llaves están colocadas, y pronto el mas grande poder que se jámas se haya creado en la tierra rugirá y se doblara a mi voluntad. ¡Tu destrucción será el testimonio de su poder y gloria!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Tus artimañas no podrán engañarnos mas, Saeth!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right ta-center',
				cssClass: 'briefing',
				popupData: {
					text: 'BLANCO ADQUIRIDO...<br>FURIA DE LOS CIELOS ACTIVADA!',
					img: ''
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¿Furia de los cielos? ¡¿Qué demonios es eso?!',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Patéticas criaturas, ¡Ésto es algo tan antiguo que no lo comprenderían ni aunque vivieran mil años! ¡Testifiquen el poder de la Furia de los Cielos!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Galamar! ¡Tenemos que apresurarnos si queremos que nuestras tropas tengan una oportunidad!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Señor, deberiamos atacar esos castillos primero antes de lanzar un ataque a las Ruinas donde está Saeth',
					img: 'i/face/soldier.png'
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
				playSound: {
					sound: 'game-complete.mp3',
					road: 0,
					isLoop: true
				},
				popupData: {
					text: 'Lamentables y miserables. Ustedes no vivirán lo suficiente para ver su precioso reino envuelto en oscuridad...',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Saeth! ¡Esta vez tu derrota en definitiva!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'En sus insignificantes vidas y estrechas mentes, quizás... Sin embargo todo esta ahora puesto en marcha - Las invisibles fuerzas que goviernan el tiempo están más allá de su compresión. ¡No pueden evitar que me levante de nuevo!',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Su Majestad, las Ruinas se están cayendo a pedazos! ¡Debemos irnos inmediatamente!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '¡Pero los Cristales... todavía siguen dentro!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '¡Lo único que podemos salvar ahora es a nosotros mismos!',
					img: 'i/face/valadorn.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Me han servido bien, ¡Ahora vamos!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langEs.story.list[5]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEs.missionComplete
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langEs.congratulations,
					text: 'Gracias por jugar AE2 - ¡Espero que hayas disfrutado jugando, tanto como yo disfrute haciendolo!'
				},
				onHide: {
					fn: 'backTo',
					args: ['', { isForce: true }]
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
					content: langRu.story.list[4]
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
					header: 'Античная цитадель'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Руины Античной Цитадели... и Саеф! С Кристаллами!',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Наконец-то, Галамар и Валадорн! Как вы храбры, чтобы противостоять мне! Все ключи на местах, и скоро величайшая сила из свех, когда либо созранных на земле подчинится моей воле. Ваше уничтожение будет доказательством этой силы!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Твои уловки больше не будут вводить нас в заблуждение, Саеф!',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right ta-center',
				cssClass: 'briefing',
				popupData: {
					text: 'ЦЕЛЬ ДОСТИГНУТА...<br>НЕБЕСНАЯ ЯРОСТЬ АКТИВИРОВАНА!',
					img: ''
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Небесная ярость? Что, именем Создателя, это такое!',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Жалкие создания, это что-то настолько древнее, чего вы не сможете понять, даже если проживете тысячи лет! Будьте свидетелями силы Небесной ярости!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Галамар! Вы должны поторопиться, чтобы наши войска получили шанс.',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Сэр, мы должны атаковать эти замки перед тем, как мы начнем нападение на Саефа и Руины.',
					img: 'i/face/soldier.png'
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
				playSound: {
					sound: 'game-complete.mp3',
					road: 0,
					isLoop: true
				},
				popupData: {
					text: 'Жалкие негодяи! Вы не проживете столько, чтобы увидеть, как ваше драгоценное Королевство поглотиться тьмой...',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Саеф! Пришло время твоего поражения!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'В твоей незначительной жизни и ограниченных мозгах, возможно...Тем не менее все сейчас в движении - невидимые силы, которые управляют временем за пределами твоих знаний. Ты не сможешь остановить меня от воскрешения!',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Ваше Величество, Руины разваливаются! Мы должны уйти немедленно!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Но Кристаллы... Они все еще там!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: 'Все что мы можем сейчас спасти - это наши жизни!',
					img: 'i/face/valadorn.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: 'Вы хорошо служили мне. А сейчас уходите!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langRu.story.list[5]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langRu.missionComplete
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langRu.congratulations,
					text: 'И благодарим вас за игру в \'Ancient Empire: Strike Back\' - я очень надеюсь, что вы насладились игрой также как я наслаждался, создавая ее!'
				},
				onHide: {
					fn: 'backTo',
					args: ['', { isForce: true }]
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
					content: langZh.story.list[4]
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
					header: '泰型材城堡'
				},
				playSound: {
					sound: 'bg-good.mp3',
					road: 0,
					isLoop: true
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '古代遗迹..水晶..还有西斯！',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '结束了，格拉玛与渥拉顿。你们真是太可笑了，居然想要对抗我！水晶的力量已经聚齐，现在我掌握了最强大的力量！我的意愿就是神的意志！来看看我是如何摧毁你们的吧！',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '你的把戏没办法愚弄我们！西斯！',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right ta-center',
				cssClass: 'briefing',
				popupData: {
					text: '目标确定...<br>天堂之怒启动!',
					img: ''
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '天堂之怒？这就是水晶的力量吗..真是太可怕了。',
					img: 'i/face/galamar.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 8, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '这就是古代遗迹的力量，你们永远都不会明白! 感受天堂之怒吧!',
					img: 'i/face/saeth.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 7, y: 2 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '格拉玛！我们必须尽快击败他!不然我们的军队就全毁了！',
					img: 'i/face/valadorn.png'
				},
				onShow: {
					fn: 'centerToXY',
					context: 'parentView',
					args: [{ x: 6, y: 15 }]
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '没错，我们必须尽快击破水晶，在西斯和他的天堂之怒再次降临以前....',
					img: 'i/face/soldier.png'
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
				playSound: {
					sound: 'game-complete.mp3',
					road: 0,
					isLoop: true
				},
				popupData: {
					text: '可笑的人类，你们将会消失在历史的尘埃里...',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '西斯！你的失败是注定的!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '在你那有限的生命与无知的思想里..也许吧。但是我的生命是无穷的，谁也无法阻止我重生!',
					img: 'i/face/saeth.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '上帝啊，遗迹正在坍塌，我们必须迅速撤离!',
					img: 'i/face/soldier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '但是水晶..他们还在这里!',
					img: 'i/face/tamplier.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'left',
				cssClass: 'briefing',
				popupData: {
					text: '我们唯一可以做的就是先救自己!',
					img: 'i/face/valadorn.png'
				}
			},
			{
				popupName: 'briefing',
				from: 'right',
				cssClass: 'briefing',
				popupData: {
					text: '你已经服务我很久了，现在，走吧!',
					img: 'i/face/galamar.png'
				}
			},
			{
				popupName: 'story',
				cssClass: 'full-screen',
				popupData: {
					content: langZh.story.list[5]
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langZh.missionComplete
				}
			},
			{
				popupName: 'simple-notification',
				popupData: {
					header: langZh.congratulations,
					text: '感谢游玩远古帝国：反击 - 我非常希望你能喜欢他!'
				},
				onHide: {
					fn: 'backTo',
					args: ['', { isForce: true }]
				}
			}
		],

		units: [
			{x: 2, y: 9, type: 'catapult', ownerId: 1},
			{x: 4, y: 9, type: 'elemental', ownerId: 1},
			{x: 3, y: 9, type: 'demon-lord', ownerId: 1},
			{x: 6, y: 9, type: 'archer', ownerId: 1},
			{x: 7, y: 9, type: 'wisp', ownerId: 1},
			{x: 7, y: 2, type: 'saeth-heavens-fury', ownerId: 1},
			{x: 12, y: 4, type: 'dragon', ownerId: 1},
			{x: 13, y: 4, type: 'demon-lord', ownerId: 1},
			{x: 6, y: 15, type: 'valadorn', ownerId: 0},
			{x: 8, y: 15, type: 'galamar', ownerId: 0},
			{x: 7, y: 15, type: 'golem', ownerId: 0},
			{x: 5, y: 15, type: 'elemental', ownerId: 0},
			{x: 6, y: 16, type: 'wisp', ownerId: 0},
			{x: 7, y: 16, type: 'catapult', ownerId: 0},
			{x: 10, y: 14, type: 'dragon', ownerId: 0}
		],
		buildings: [
			{x: 0, y: 12, type: 'farm', state: 'normal'},
			{x: 3, y: 16, type: 'farm', state: 'normal'},
			{x: 3, y: 9, type: 'castle', state: 'normal', ownerId: 1},
			{x: 4, y: 3, type: 'farm', state: 'normal', ownerId: 1},
			{x: 7, y: 4, type: 'farm', state: 'normal', ownerId: 1},
			{x: 9, y: 1, type: 'farm', state: 'normal', ownerId: 1},
			{x: 12, y: 3, type: 'farm', state: 'normal', ownerId: 1},
			{x: 13, y: 4, type: 'castle', state: 'normal', ownerId: 1},
			{x: 6, y: 9, type: 'farm', state: 'normal', ownerId: 1},
			{x: 4, y: 11, type: 'farm', state: 'normal'},
			{x: 12, y: 15, type: 'farm', state: 'normal', ownerId: 0},
			{x: 8, y: 17, type: 'farm', state: 'normal', ownerId: 0},
			{x: 8, y: 15, type: 'castle', state: 'normal', ownerId: 0},
			{x: 10, y: 9, type: 'farm', state: 'destroyed'},
			{x: 12, y: 6, type: 'farm', state: 'destroyed'}
		],
		terrain: {
			x0y0: 'water-1',
			x0y1: 'water-1',
			x0y2: 'water-1',
			x0y3: 'water-1',
			x0y4: 'water-1',
			x0y5: 'water-3',
			x1y0: 'stone-1',
			x1y1: 'forest-2',
			x1y2: 'stone-1',
			x1y3: 'water-1',
			x1y4: 'water-2',
			x1y5: 'water-1',
			x2y0: 'forest-1',
			x2y1: 'stone-1',
			x2y2: 'forest-1',
			x2y3: 'water-1',
			x2y4: 'water-1',
			x2y5: 'water-3',
			x3y0: 'stone-1',
			x3y1: 'stone-1',
			x3y2: 'forest-2',
			x3y3: 'water-1',
			x3y4: 'water-1',
			x3y5: 'water-1',
			x4y0: 'stone-1',
			x4y1: 'stone-1',
			x4y2: 'stone-1',
			x4y3: 'terra-1',
			x4y4: 'stone-1',
			x4y5: 'water-1',
			x5y0: 'stone-1',
			x5y1: 'forest-2',
			x5y2: 'terra-1',
			x5y3: 'stone-1',
			x5y4: 'forest-1',
			x5y5: 'water-1',
			x6y0: 'hill-1',
			x6y1: 'terra-1',
			x6y2: 'terra-2',
			x6y3: 'terra-1',
			x6y4: 'forest-1',
			x6y5: 'stone-1',
			x7y0: 'terra-1',
			x7y1: 'terra-5',
			x7y2: 'terra-3',
			x7y3: 'terra-1',
			x7y4: 'terra-1',
			x7y5: 'forest-2',
			x8y0: 'forest-2',
			x8y1: 'terra-1',
			x8y2: 'terra-4',
			x8y3: 'terra-1',
			x8y4: 'terra-1',
			x8y5: 'hill-1',
			x9y0: 'stone-1',
			x9y1: 'terra-1',
			x9y2: 'terra-1',
			x9y3: 'stone-1',
			x9y4: 'terra-1',
			x9y5: 'terra-1',
			x10y0: 'forest-1',
			x10y1: 'stone-1',
			x10y2: 'stone-1',
			x10y3: 'hill-1',
			x10y4: 'terra-1',
			x10y5: 'hill-1',
			x11y0: 'forest-2',
			x11y1: 'forest-1',
			x11y2: 'hill-1',
			x11y3: 'terra-1',
			x11y4: 'forest-2',
			x11y5: 'road-1',
			x12y0: 'forest-1',
			x12y1: 'forest-2',
			x12y2: 'forest-1',
			x12y3: 'terra-1',
			x12y4: 'terra-1',
			x12y5: 'road-1',
			x13y0: 'forest-2',
			x13y1: 'hill-1',
			x13y2: 'terra-2',
			x13y3: 'terra-1',
			x13y4: 'terra-1',
			x13y5: 'road-1',
			x0y6: 'water-1',
			x1y6: 'water-1',
			x2y6: 'water-1',
			x3y6: 'water-1',
			x4y6: 'water-1',
			x5y6: 'water-1',
			x6y6: 'water-1',
			x7y6: 'water-1',
			x8y6: 'water-1',
			x9y6: 'forest-1',
			x10y6: 'terra-1',
			x11y6: 'road-1',
			x12y6: 'terra-1',
			x13y6: 'forest-2',
			x0y7: 'stone-1',
			x1y7: 'forest-2',
			x2y7: 'water-1',
			x3y7: 'water-1',
			x4y7: 'water-2',
			x5y7: 'water-1',
			x6y7: 'water-3',
			x7y7: 'water-1',
			x8y7: 'water-1',
			x9y7: 'forest-1',
			x10y7: 'road-1',
			x11y7: 'road-1',
			x12y7: 'hill-1',
			x13y7: 'forest-2',
			x0y8: 'forest-1',
			x1y8: 'forest-1',
			x2y8: 'forest-2',
			x3y8: 'water-1',
			x4y8: 'water-1',
			x5y8: 'water-1',
			x6y8: 'water-1',
			x7y8: 'water-1',
			x8y8: 'stone-1',
			x9y8: 'road-1',
			x10y8: 'road-1',
			x11y8: 'terra-1',
			x12y8: 'stone-1',
			x13y8: 'forest-1',
			x0y9: 'road-1',
			x1y9: 'road-1',
			x2y9: 'stone-1',
			x3y9: 'terra-1',
			x4y9: 'terra-1',
			x5y9: 'stone-1',
			x6y9: 'terra-1',
			x7y9: 'hill-1',
			x8y9: 'road-1',
			x9y9: 'road-1',
			x10y9: 'terra-1',
			x11y9: 'forest-2',
			x12y9: 'water-1',
			x13y9: 'water-1',
			x0y10: 'hill-1',
			x1y10: 'road-1',
			x2y10: 'road-1',
			x3y10: 'road-1',
			x4y10: 'road-1',
			x5y10: 'road-1',
			x6y10: 'road-1',
			x7y10: 'road-1',
			x8y10: 'road-1',
			x9y10: 'terra-1',
			x10y10: 'water-1',
			x11y10: 'water-1',
			x12y10: 'water-1',
			x13y10: 'water-3',
			x0y11: 'stone-1',
			x1y11: 'hill-1',
			x2y11: 'terra-1',
			x3y11: 'road-1',
			x4y11: 'terra-1',
			x5y11: 'forest-1',
			x6y11: 'forest-2',
			x7y11: 'terra-1',
			x8y11: 'stone-1',
			x9y11: 'water-1',
			x10y11: 'water-1',
			x11y11: 'water-1',
			x12y11: 'water-1',
			x13y11: 'water-1',
			x0y12: 'terra-1',
			x1y12: 'terra-1',
			x2y12: 'forest-2',
			x3y12: 'road-1',
			x4y12: 'stone-1',
			x5y12: 'water-1',
			x6y12: 'water-1',
			x7y12: 'bridge-2',
			x8y12: 'water-1',
			x9y12: 'water-1',
			x10y12: 'water-2',
			x11y12: 'water-1',
			x12y12: 'water-1',
			x13y12: 'water-1',
			x0y13: 'forest-1',
			x1y13: 'stone-1',
			x2y13: 'terra-1',
			x3y13: 'road-1',
			x4y13: 'hill-1',
			x5y13: 'water-1',
			x6y13: 'water-1',
			x7y13: 'bridge-2',
			x8y13: 'water-1',
			x9y13: 'water-1',
			x10y13: 'water-1',
			x11y13: 'water-1',
			x12y13: 'forest-1',
			x13y13: 'forest-1',
			x0y14: 'water-1',
			x1y14: 'water-1',
			x2y14: 'stone-1',
			x3y14: 'road-1',
			x4y14: 'terra-1',
			x5y14: 'water-1',
			x6y14: 'water-1',
			x7y14: 'road-1',
			x8y14: 'hill-1',
			x9y14: 'forest-1',
			x10y14: 'terra-1',
			x11y14: 'terra-1',
			x12y14: 'terra-1',
			x13y14: 'forest-2',
			x0y15: 'water-1',
			x1y15: 'water-1',
			x2y15: 'forest-1',
			x3y15: 'road-1',
			x4y15: 'road-1',
			x5y15: 'road-1',
			x6y15: 'terra-1',
			x7y15: 'road-1',
			x8y15: 'terra-1',
			x9y15: 'terra-1',
			x10y15: 'hill-1',
			x11y15: 'terra-1',
			x12y15: 'terra-1',
			x13y15: 'stone-1',
			x0y16: 'water-2',
			x1y16: 'water-1',
			x2y16: 'water-1',
			x3y16: 'terra-1',
			x4y16: 'terra-1',
			x5y16: 'road-1',
			x6y16: 'road-1',
			x7y16: 'road-1',
			x8y16: 'road-1',
			x9y16: 'road-1',
			x10y16: 'road-1',
			x11y16: 'road-1',
			x12y16: 'road-1',
			x13y16: 'road-1',
			x0y17: 'water-1',
			x1y17: 'water-3',
			x2y17: 'water-1',
			x3y17: 'water-1',
			x4y17: 'water-1',
			x5y17: 'forest-1',
			x6y17: 'stone-1',
			x7y17: 'road-1',
			x8y17: 'terra-1',
			x9y17: 'forest-1',
			x10y17: 'forest-1',
			x11y17: 'forest-2',
			x12y17: 'stone-1',
			x13y17: 'forest-1'
		}
	};

}(window));