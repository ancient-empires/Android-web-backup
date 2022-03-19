/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */
	/*global APP */

	win.APP = win.APP || {};

	APP.languages = APP.languages || {};

	APP.languages.zh = {
		language: '语言',
		languageName: '简体中文',
		shortLanguageName: 'CHS',
		appName: '远古帝国：反击',

		//theme: 'Theme',
		//share: 'Share',

		// title page
		play: '游戏',
		online: '在线模式',
		settings: '系统设置',
		instructions: '操作提示',
		about: '相关',

		// settings
		on: '开启',
		off: '关闭',
		music: '音乐',
		vibrate: '振动',
		help: '帮助',
		youCanDisableHelpNotification: '你可以开启/关闭帮助文本在\'系统设置\'',
		fightAnimation: '战斗动画',
		gameSpeed: '游戏速度',
		confirmTurn: '确认回合',
		confirmMove: '确认移动',
		confirmAttack: '确认进攻',
		'gameSpeed-1': '慢速',
		'gameSpeed-2': '较慢',
		'gameSpeed-3': '正常',
		'gameSpeed-4': '较快',
		'gameSpeed-5': '快速',
		mainSettings: '主要设置',
		gameDifficulty: '游戏难度',
		font: '字体',
		easy: '简单',
		normal: '正常',
		hard: '困难',
		buildingSmoke: '建筑烟雾',
		unitAnimation: '单位动画',
		autoSave: '自动保存',

		// play
		companies: '新游戏',
		loadGame: '载入游戏',
		selectLevel: '选择等级',
		skirmish: '遭遇战',
		userMaps: '自制地图',
		userMap: '编辑地图',
		mission: '战役',

		// setup skirmish
		player: '玩家',
		cpu: '电脑',
		none: '空白',
		money: '起始资金',
		unitLimit: '单位限制',
		fight: '战斗',
		team: '队伍',

		// colors
		blue: '蓝色',
		red: '红色',
		green: '绿色',
		black: '黑色',

		rateUs: {
			header: '请给我们的产品打个分吧！',
			notNow: '不是现在！',
			fiveStars: '没问题！五星好评！'
		},

		// unit store
		unitStoreHeader: '单位',

		// popups
		endTurnQuestion: '结束回合吗？',
		yes: '是的',
		no: '不要',
		ok: '好的',
		continue: '继续',
		congratulations: '恭喜你!',
		gameSaved: '游戏已保存',
		unlocked: '解锁!',

		//save/load popup
		save: '保存',
		delete: '删除',
		replace: '替换',
		saveGame: '保存游戏',
		areYouSureToDeleteSavedGame: '你确定要删除已保存的游戏吗？',
		areYouSureToLoadGame: '你确定要载入档案吗？',
		noSavedGames: '没有记录',
		load: '载入',

		// end game
		blackDefeat: '黑色队伍被击败了!',
		blueDefeat: '蓝色队伍被击败了!',
		greenDefeat: '绿色队伍被击败了!',
		redDefeat: '红色队伍被击败了!',
		victory: '胜利!',
		defeat: '失败!',
		missionComplete: '任务完成!',
		restartBattle: '重新开始',
		quitBattle: '退出',
		areYouSureToQuitBattle: '你确定要离开战役吗?',
		areYouSureToRestartBattle: '你确定要重新开始战役吗?',

		// notification
		objective: '任务目标e',
		skirmishObjective: '击败敌方的指挥官并占领所有城堡!',
		newTurn: '新回合!',
		income: '收入',
		tooMuchUnits: '过多的单位!',

		//battle menu
		menu: '菜单',

		// map editor
		mapEditor: '地图编辑器',
		maps: '地图',
		width: '宽度',
		height: '高度',
		name: '名称',
		colors: '颜色',
		open: '打开',
		clean: '清除',
		exit: '退出',
		areYouSureToLeaveMapEditor: '你确定要退出地图编辑器吗?',
		unsavedMapProgressWillBeLost: '未保存的数据将会丢失!',
		noSavedMaps: '没有保存过的地图',
		youAreSureToDeleteMap: '确定要删除地图吗?',
		mapHasBeenSaved: '地图已保存.',
		mapHasBeenDeleted: '地图已删除',
		cleanMapNotSavedDataWillBeLost: '要清除地图吗？未被保存的数据将会遗失.',
		needMoreUnitsOrBuildings: '需要更多单位或建筑',
		enterMapName: '输入地图名称',
		mapName: '地图名称',

		// other
		disableAllTips: '关闭所有提示',

		//aboutText: '<br><br><br>Ancient Empire: Strike Back.<br><br><br><!--Programmer:<br>Dmitry Turovtsov<br><br>Thanks:<br>Alexey Danilov<br>Pavel Prylutski<br>Igor Kupreev<br>Pavel Sychykau-->',
		aboutText: '<br><br><br>Ancient Empire:<br>Strike Back<br><br><br>',
		instructionsText: [
			'\'Ancient Empire: Strike Back\' 是一款惊心动魄的策略战棋游戏，你需要控制国王格拉玛和他的兄弟渥拉顿与恶魔战斗来保卫他们的国度。',
			'接下来是一些关于如何进行游戏的提示（在游戏过程中也可以看到这些提示）。',
			'红色的区域是一个单位可以移动的范围. 一个单位可以移动的范围由它的兵种属性和地形共同决定。',
			'不同的地形会影响单位的移动、攻击和防御。举例来说，山地形可以提高单位的防御力，但是减少单位的移动力。当你把光标移动到不同的地形上时，屏幕上将会出现相关的说明。',
			'当一个单位行动完成后，他的颜色将会变灰，并且在你的下一个回合前将无法行动。',
			'每回合你可以让你的每个单位行动一次。 当你的所有单位均行动完毕后请点击 \'结束回合\'.',
			'你的单位可以在战斗中获得经验值并升级，这会让他们变得更强。',
			'你可以双击一个选取的单位来查看他的攻击范围。',
			'想攻击一个敌方单位，将你的单位移动到他的附近并点选 \'攻击\'. 如果范围内有不止一个目标，你需要选取进攻的对象。进攻的效果取决于单位的能力和地形。',
			'只有指挥官可以占领城堡。当一个城堡被占领时你可以用金币来征召新的单位。即使指挥官不在城堡里你依然可以这样做。',
			'你可以将指挥官或者士兵移动到建筑上并点击 \'占领\'来占领建筑。当一个建筑被占领时，它的颜色将会改变。当一个建筑被破坏时，你必须先修复它，才能占领。',
			'每一个被占领的建筑都会提供给你金币，多占领建筑来提升你的收入！',
			'单位可以在建筑里获得回复，停留的时间越长，回复越多。',
			'当指挥官被击败后，可以在城堡中重新征召。',
			'水元素是神奇的生物，在水中他们可以获得攻击力、防御力和移动上的加成。',
			'恶狼的攻击是有毒的！这种毒将会虚弱目标一个回合。',
			'女巫可以从死亡单位的墓碑上召唤骷髅。当一个单位死亡后，将会产生一个持续1回合的墓碑。将你的女巫移动到墓碑边上并选择 \'召唤\'.',
			'小精灵可以保护周围的友方单位，给他们提供一个增加攻击力的光环。',
			'投石机可以帮助你破坏敌方的建筑，切断他们的经济来源。',
			'确保你的龙远离弓箭手！面对弓箭它们非常的脆弱！'
		],
		helpList: [
			// 0
			{
				img: 'img/help/select-unit.png',
				text: ['要选择一个单位请单击 (<img src="img/help/tap-finger.png" class="icon-in-text" />) 该单位。', '<img src="img/help/finger-on-red-square.png" class="icon-in-text" /> - 红色的区域是一个单位可以移动的范围。', '一个单位可以移动的范围由它的兵种属性和地形共同决定。']
			},
			// 1
			{
				img: 'img/help/attack.png',
				text: ['想攻击一个敌方单位，将你的单位移动到他的附近并点选 \'攻击\' <img src="img/help/attack-icon.png" class="icon-in-text" />。', '如果范围内有不止一个目标，你需要选取进攻的对象。进攻的效果取决于单位的能力和地形。']
			},
			// 2
			{
				//img: 'img/help/occupy-castle.png',
				text: ['只有指挥官可以占据一座城堡 (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />)。', '一旦城堡被占用，你可以购买新的单位，你的黄金。', '指挥官并不需要留在城堡以购买单位。']
			},
			// 3
			{
				//img: 'img/help/occupy-farm.png',
				text: ['您可以通过移动一个士兵或指挥官到它，选择占据建筑\'占据\' (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />)。', '一旦建筑物被占用，它会改变颜色。', '如果建筑物被损坏，你必须修复的建筑可占据前(<img src="img/help/fix-building-icon.png" class="icon-in-text" />)。']
			},
			// 4
			{
				img: 'img/help/raise.png',
				text: ['一个法师必须从阵亡单位的坟墓召唤骷髅战士的力量。', '后一个单元被击败，墓碑出现1回合。', '将旁边的一个墓碑一个法师，然后选择\'加薪\' <img src="img/help/attack-icon.png" class="icon-in-text" />。']
			}
		],
		unitsList: {
			'soldier': {
				name: '士兵',
				description: '士兵是全能型的战士，是所有部队的基础。士兵也是唯一可以占领建筑来产生金币的单位。'
			},
			'archer': {
				name: '弓箭手',
				description: '装备着精良的弓箭，弓箭手们可以在远处发起强大的攻击，尤其对空中的生物非常致命。'
			},
			'elemental': {
				name: '水元素',
				description: '水元素是神奇的生物，在水中他们可以获得攻击力、防御力和移动上的加成。'
			},
			'sorceress': {
				name: '女巫',
				description: '钻研着神秘的黑魔法，虽然对于近身战斗并不擅长，女巫却可以从墓碑中召唤出可怕的骷髅战士来改变战局。'
			},
			'wisp': {
				name: '小精灵',
				description: '这种神奇的光亮生物可以给附近的友军提供一个增加攻击力的光环，他们的光芒也对骷髅非常致命。'
			},
			'dire-wolf': {
				name: '恶狼',
				description: '恶狼是邪恶的觅食者。他们的毒牙可以削弱目标的攻击力与防御力一回合。'
			},
			'golem': {
				name: '石像',
				description: '石像是远古的生物——缓慢却坚韧。一个驻守在建筑里的石像是非常难以被击败的。'
			},
			'catapult': {
				name: '投石车',
				description: '投石车有着长远的射程和恐怖的破坏力，然而这样的优势却也有着相当大的代价，那就是移动与攻击不能并存。他们可以破坏你的建筑来阻止你获得金币，要小心了。'
			},
			'dragon': {
				name: '龙',
				description: '这种传奇的生物一直都生活在世界的顶端，他们的吐息对于任何生物来说都是一种灾难，他们的翅膀也帮助他们可以在各种地形上高速移动。'
			},
			'skeleton': {
				name: '骷髅',
				description: '被女巫从墓碑中召唤出来，这种不死的生物对于死亡没有任何的恐惧，尽管战斗力不如生前，他们依然是战场上不可忽视的力量。'
			},
			'galamar': {
				name: '格拉玛',
				description: '格拉玛 (指挥官) 在攻防两端都有着优异的能力，是军队的核心与领袖。 当被击败后，指挥官也可以在城堡中被复活。游戏的每一种势力都有对应的指挥官。'
			},
			'valadorn': {
				name: '渥拉顿',
				description: '渥拉顿 (指挥官)在攻防两端都有着优异的能力，是军队的核心与领袖。 当被击败后，指挥官也可以在城堡中被复活。游戏的每一种势力都有对应的指挥官。'
			},
			'demon-lord': {
				name: '恶魔领主',
				description: '恶魔领主 (指挥官)在攻防两端都有着优异的能力，是军队的核心与领袖。 当被击败后，指挥官也可以在城堡中被复活。游戏的每一种势力都有对应的指挥官。'
			},
			'saeth': {
				name: '西斯',
				description: '西斯 (指挥官)在攻防两端都有着优异的能力，是军队的核心与领袖。 当被击败后，指挥官也可以在城堡中被复活。游戏的每一种势力都有对应的指挥官。'
			},
			'crystal': {
				name: '水晶',
				description: '从远古遗迹中被发现的水晶，具备着神秘的能量，正义的人认为他象征着守护，而邪恶的人则利用他实施毁灭。'
			}
		},

		story: {
			list: [
				// 0
				'img/story/story-1-1.png_!_随着与黑暗势力作战的不断升级，国王格拉玛和他的兄弟渥拉顿为了遵守守卫领土的誓言再次联合在了一起。这个王国的和平是同三个守护水晶紧紧联系在一起的，而这些水晶正存放在勇气、智慧与生命神殿里。然而现在，战火已经波及到了这些神殿...',
				// 1
				'img/story/story-1-2.png_!_\'三个水晶，有人想要守护他们，而有人想要破坏他们。这些水晶是远古的产物，具有神秘的灵魂能量，没有人知道，他们会给这世界带来黑暗还是光明的力量...',
				// 2
				'img/story/story-1-3.png_!_勇气神殿的信使来到了城堡的大门前,向国王传递着信息——勇气神殿正在遭受攻击，我们必须守护住神殿...',
				// 3
				'img/story/story-4-1.png_!_借助这些精灵的帮助，国王格拉玛紧随着黑暗势力的脚步，到达了神殿...',
				// 4
				'img/story/story-8-1.png_!_格拉玛与渥拉顿追随着巨龙的足迹，最后却发现他们已经身处在一个古代遗迹之中...',
				// 5
				'img/story/story-8-2.png_!_\'世界终将和平，天空终将湛蓝。这些妄图摧毁世界的人必须被摧毁，想要夺取和平的人也终将被消灭。新的世界就要来临了。'
			]
		}

	};

}(window));