/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */
	/*global APP */

	win.APP = win.APP || {};

	APP.languages = APP.languages || {};

	APP.languages.en = {
		language: 'Language',
		languageName: 'English',
		shortLanguageName: 'Eng',
		appName: 'AE2FG',

		//theme: 'Theme',
		//share: 'Share',

		// title page
		play: 'Play',
		online: 'Online',
		settings: 'Settings',
		instructions: 'Instructions',
		about: 'About',

		// settings
		on: 'on',
		off: 'off',
		music: 'music',
		vibrate: 'vibrate',
		help: 'help',
		youCanDisableHelpNotification: 'You can enable/disable help notification from \'Settings\'',
		fightAnimation: 'fight animation',
		gameSpeed: 'Game speed',
		confirmTurn: 'confirm turn',
		confirmMove: 'confirm move',
		confirmAttack: 'confirm attack',
		'gameSpeed-1': 'slower',
		'gameSpeed-2': 'slow',
		'gameSpeed-3': 'normal',
		'gameSpeed-4': 'fast',
		'gameSpeed-5': 'faster',
		mainSettings: 'Main settings',
		gameDifficulty: 'Game difficulty',
		font: 'Font',
		easy: 'easy',
		normal: 'normal',
		hard: 'hard',
		buildingSmoke: 'house smoke',
		unitAnimation: 'unit animation',
		autoSave: 'auto save',

		// play
		companies: 'Companies',
		loadGame: 'Load game',
		selectLevel: 'Select level',
		skirmish: 'Skirmish',
		userMaps: 'User maps',
		userMap: 'User map',
		mission: 'Mission',

		// setup skirmish
		player: 'Player',
		cpu: 'CPU',
		none: 'None',
		money: 'Money',
		unitLimit: 'Unit limit',
		fight: 'Fight',
		team: 'Team',

		// colors
		blue: 'blue',
		red: 'red',
		green: 'green',
		black: 'black',

		rateUs: {
			header: 'Rate us, please!',
			notNow: 'not now',
			fiveStars: 'Yes, 5 stars!'
		},

		// unit store
		unitStoreHeader: 'Units',

		// popups
		endTurnQuestion: 'End Turn?',
		yes: 'Yes',
		no: 'No',
		ok: 'Ok',
		continue: 'Continue',
		congratulations: 'Congratulations!',
		gameSaved: 'Game saved',
		unlocked: 'unlocked!',

			//save/load popup
		save: 'Save',
		delete: 'Delete',
		replace: 'Replace',
		saveGame: 'Save game',
		areYouSureToDeleteSavedGame: 'Are you sure to delete saved game?',
		areYouSureToLoadGame: 'Are you sure to load game?',
		noSavedGames: 'No saved games',
		load: 'Load',

			// end game
		blackDefeat: 'Black player was defeat!',
		blueDefeat: 'Blue player was defeat!',
		greenDefeat: 'Green player was defeat!',
		redDefeat: 'Red player was defeat!',
		victory: 'Victory!',
		defeat: 'Defeat!',
		missionComplete: 'Mission complete!',
		restartBattle: 'Restart',
		quitBattle: 'Quit',
		areYouSureToQuitBattle: 'Are you sure to quit battle?',
		areYouSureToRestartBattle: 'Are you sure to restart the battle?',

			// notification
		objective: 'Objective',
		skirmishObjective: 'Defeat the enemy commander and occupy all enemy castles!',
		newTurn: 'New turn!',
		income: 'Income',
		tooMuchUnits: 'Too much units!',

			//battle menu
		menu: 'Menu',

		// map editor
		mapEditor: 'Map editor',
		maps: 'Maps',
		width: 'Width',
		height: 'Height',
		name: 'Name',
		colors: 'Colors',
		open: 'Open',
		clean: 'Clean',
		exit: 'Exit',
		areYouSureToLeaveMapEditor: 'Are you sure to leave map editor?',
		unsavedMapProgressWillBeLost: 'Unsaved map progress will be lost!',
		noSavedMaps: 'No saved maps',
		youAreSureToDeleteMap: 'You are sure to delete map?',
		mapHasBeenSaved: 'map has been saved.',
		mapHasBeenDeleted: 'map has been deleted.',
		cleanMapNotSavedDataWillBeLost: 'Clean map? Not saved data will be lost.',
		needMoreUnitsOrBuildings: 'Need more Units or Buildings',
		enterMapName: 'Enter map name',
		mapName: 'Map name',

		// other
		disableAllTips: 'Disable ALL tips',

		//aboutText: '<br><br><br>Ancient Empire: Strike Back.<br><br><br><!--Programmer:<br>Dmitry Turovtsov<br><br>Thanks:<br>Alexey Danilov<br>Pavel Prylutski<br>Igor Kupreev<br>Pavel Sychykau-->',
		aboutText: '<br><br><br>Ancient Empire:<br>Strike Back<br><br><br>',
		instructionsText: [
			'\'Ancient Empire: Strike Back\' is a thrilling strategy game that lets you control King Galamar and his brother Valadorn as they fight to protect their kingdom from evil.',
			'Next are instructions, hints and tips on how to play which also appear in the game.',
			'The red squares mark the movement range of a unit. A unit\'s range is determined by its type and the terrain it is on.',
			'Different types of terrain affect a unit\'s ability to move, attack and defend. For example, mountains add defence points but reduce movement. When you move the cursor these terrain features appear at the bottom of the screen.',
			'When a unit has completed a move, it will change to grey. This means that it cannot be used again until your next turn.',
			'You can move each unit only once each turn. When you have finished moving all your units tap \'end turn\'.',
			'Units get more powerful as they gain battle experience and are upgraded in rank.',
			'You can view the attack range of any unit by double tap when it is selected.',
			'To attack an enemy unit, move your unit within range and select \'attack\'. If there is more than one enemy in range, select which unit to attack. The success of your attack is determined by unit characteristics and terrain.',
			'Only a Commander can occupy a castle. Once a castle is occupied you can purchase new units with your gold. The Commander does not need to remain in the castle in order to purchase units.',
			'You can occupy buildings by moving a Soldier or Commander onto it and selecting \'occupy\'. Once a building is occupied, it changes colour. If a building is damaged you must repair the building before it can be occupied.',
			'Once a building has been occupied, it earns gold. The more buildings you occupy, the more gold you earn.',
			'Units can be healed by occupying buildings. The longer a unit stays, the more life it regains.',
			'If a Commander is defeated in battle, he can be resurrected in a castle.',
			'Water Elementals are amphibious, giving them increased movement, attack and defence when in water.',
			'An attack by Dire Wolves is poisonous. A poisoned unit is slow and weak for its next turn.',
			'A Sorceress has the power to summon skeleton warriors from the graves of fallen units. After a unit has been defeated, a tombstone appears for 1 turn. Move a Sorceress next to a tombstone and select \'raise\'.',
			'Use Wisps to provide nearby friendly units with an aura that augments their attack points.',
			'The Catapult has the ability to destroy the enemy towns and help disrupt the flow of gold.',
			'Keep your Dragons away from enemy archers, as they are vulnerable to arrows!'
		],
		helpList: [
			// 0
			{
				img: 'img/help/select-unit.png',
				text: ['To select unit tap (<img src="img/help/tap-finger.png" class="icon-in-text" />) to unit.', '<img src="img/help/finger-on-red-square.png" class="icon-in-text" /> - the red squares mark the movement range of a unit.', 'A unit\'s range is determined by its type and the terrain it is on.']
			},
			// 1
			{
				img: 'img/help/attack.png',
				text: ['To attack an enemy unit, move your unit within range and select <img src="img/help/attack-icon.png" class="icon-in-text" />.', 'If there is more than one enemy in range, select which unit to attack. The success of your attack is determined by unit characteristics and terrain.']
			},
			// 2
			{
				//img: 'img/help/occupy-castle.png',
				text: ['Only a Commander can occupy (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />) a castle.', 'Once a castle is occupied you can purchase new units with your gold.', 'The Commander does not need to remain in the castle in order to purchase units.']
			},
			// 3
			{
				//img: 'img/help/occupy-farm.png',
				text: ['You can occupy buildings by moving a Soldier or Commander onto it and selecting \'occupy\' (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />).', 'Once a building is occupied, it changes colour.', 'If a building is damaged you must repair (<img src="img/help/fix-building-icon.png" class="icon-in-text" />) the building before it can be occupied.']
			},
			// 4
			{
				img: 'img/help/raise.png',
				text: ['A Sorceress has the power to summon Skeleton warriors from the graves of fallen units.', 'After a unit has been defeated, a tombstone appears for 1 turn.', 'Move a Sorceress next to a tombstone and select \'raise\' <img src="img/help/attack-icon.png" class="icon-in-text" />.']
			}
		],
		unitsList: {
			'soldier': {
				name: 'Soldier',
				description: 'Soldiers are solid all-round fighters that form the backbone of any army. Soldiers are also the only unit that can capture towns to earn gold.'
			},
			'archer': {
				name: 'Archer',
				description: 'With their powerful bows archers can attack from a distance and are especially powerful against airborne enemies.'
			},
			'elemental': {
				name: 'Elemental',
				description: 'Elementals are magical water spirits. When in water, Elementals have greater movement and stronger defence.'
			},
			'sorceress': {
				name: 'Sorceress',
				description: 'Skilled in the use of magic, Sorceresses are weak in close combat. However, their ability to summon fighting skeletons from dead troops can be decisive in battle.'
			},
			'wisp': {
				name: 'Wisp',
				description: 'These mystical beings of pure light radiate an aura which strengthens the attacking abilities of nearby friendly units. In close combat they are especially deadly against skeletons.'
			},
			'dire-wolf': {
				name: 'Dire wolf',
				description: 'Dire Wolves are feared hunters that travel in packs. Beware - their bite is poisonous and reduces both attack and defence levels for one turn.'
			},
			'golem': {
				name: 'Golem',
				description: 'Golems are ancient beings - slow but immensely strong in defence. A golem stationed in a building or a well defended mountain is very difficult to defeat.'
			},
			'catapult': {
				name: 'Catapult',
				description: 'Catapults blaze a trail of destruction with their enormous attack range. However, their relative immobility and inability to attack up close make them vulnerable, so guard them well. Catapults can either move or attack during a turn, but not do both.'
			},
			'dragon': {
				name: 'Dragon',
				description: 'These massive flying beasts have ruled over the mountains of mist since ancient times. They are extremely mobile as well as deadly in attack on land, air and sea.'
			},
			'skeleton': {
				name: 'Skeleton',
				description: 'Summoned by Sorceresses, these lifeless warriors are as strong as soldiers and deadly opponents on any battlefield.'
			},
			'galamar': {
				name: 'Galamar',
				description: 'Galamar (commander) is very strong in attack and defence. Commanders can also occupy castles to produce troops and can be revived in the castle if they fall in battle.'
			},
			'valadorn': {
				name: 'Valadorn',
				description: 'Valadorn (commander) is very strong in attack and defence. Commanders can also occupy castles to produce troops and can be revived in the castle if they fall in battle.'
			},
			'demon-lord': {
				name: 'Demon Lord',
				description: 'Demon Lords (commander) is very strong in attack and defence. Commanders can also occupy castles to produce troops and can be revived in the castle if they fall in battle.'
			},
			'saeth': {
				name: 'Saeth',
				description: 'Saeth (commander) is very strong in attack and defence. Commanders can also occupy castles to produce troops and can be revived in the castle if they fall in battle.'
			},
			'crystal': {
				name: 'Crystal',
				description: 'These legendary Crystals were originally retrieved from the ruins of the Ancient Citadel. Little is known of their power, except that they are rumoured to protect the kingdom, while also possessing the power to destroy it.'
			}
		},

		story: {
			list: [
				// 0
				'img/story/story-1-1.png_!_With the passing of the war against the forces of darkness, the brothers Galamar and Valadorn are reunited in their rule of the kingdom of Thorin. The kingdom is slowly returning to its peace time ways, protected by three ancient crystals safely guarded in the temples of Courage, Wisdom and Life, when rumours of skirmishes in the North reach the palace...',
				// 1
				'img/story/story-1-2.png_!_\'And three was their number, three to protect, three to destroy. Mercy upon the wielder of their power, mercy upon our souls, for He shall unleash the heavenly fires onto this world.\'<br \/>[Verse 3:7 from the Crystal Prophecies, author unknown, translated from the only surviving transcript from the Age of Darkness]',
				// 2
				'img/story/story-1-3.png_!_A messenger from the Temple of Courage arrives at the castle gates, pleading for the King\'s assistance - the Temple has fallen prey to brutal attackers, and must be protected...',
				// 3
				'img/story/story-4-1.png_!_With the help of the Elementals, King Galamar finally reaches the Temple of Life one step before the enemy...',
				// 4
				'img/story/story-8-1.png_!_Galamar and Valadorn follow the path of destruction left behind by the dragon and find themselves at the ruins of the Ancient Citadel...',
				// 5
				'img/story/story-8-2.png_!_\'And the Earth shall tremble, and the skies shall weep. For He who is the destroyer shall be destroyed, for the He who is the taker shall be taken. And a new age, free of evil and darkness shall dawn.\'<br>[Final verse from the Crystal Prophecies, author unknown, never translated, lost during the age of darkness]'
			]
		}

	};

}(window));