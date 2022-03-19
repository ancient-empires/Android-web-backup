/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */

	function Grave(data) {
		this.id = data.id;
		this.x = data.x;
		this.y = data.y;
		this.currentTime = 1;
	}

	Grave.prototype = {
		maxTtl: 3,
		increaseTime: function () {
			this.currentTime += 1;
		},
		needRemove: function () {
			return this.currentTime > this.maxTtl;
		}
	};

	win.APP.unitMaster = {
		unitCounter: 1, // set unit id
		graveCounter: 1, // set grave id
		createGrave: function (data) {

			data.id = this.graveCounter;
			this.graveCounter += 1;

			return new Grave(data);
		},
		createUnit: function (data) {

			data.id = this.unitCounter;
			this.unitCounter += 1;

			return new win.APP.BB.Unit[this.list[data.type].modelName](data);

		},
		defByLevel: 2,
		atkByLevel: 2,
		reduceMoveByPoison: 1,
		bonusAtkByWispAura: 10,
		reduceAktPoison: 10,
		reduceDefPoison: 10,
		bonusAtkByWater: 10,
		bonusDefByWater: 15,
		levelList: [0, 84, 172, 265, 362, 464, 571, 684, 802, 926], // prev + (prev +5%) for every level
		commanderList: ['galamar', 'valadorn', 'demon-lord', 'saeth'],
		noInEditor: ['saeth-heavens-fury', 'crystal'],
		commanderAddedCost: 200,
		list: {

			// commanders
			galamar: {
				atk: {
					min: 55,
					max: 65
				},
				atkRange: 2,
				//atk: {
				//	min: 155,
				//	max: 165
				//},
				//atkRange: 7,
				def: 20,
				mov: 5,
				modelName: 'GalamarModel',
				langKey: 'galamar',
				canFixBuilding: true,
				withoutGrave: true,
				listOccupyBuilding: ['farm', 'castle'],
				cost: 200
			},
			valadorn: {
				atk: {
					min: 55,
					max: 65
				},
				atkRange: 2,
				def: 20,
				mov: 5,
				modelName: 'ValadornModel',
				langKey: 'valadorn',
				canFixBuilding: true,
				withoutGrave: true,
				listOccupyBuilding: ['farm', 'castle'],
				cost: 200
			},
			'demon-lord': {
				atk: {
					min: 55,
					max: 65
				},
				atkRange: 2,
				def: 20,
				mov: 5,
				modelName: 'DemonLordModel',
				langKey: 'demon-lord',
				canFixBuilding: true,
				withoutGrave: true,
				listOccupyBuilding: ['farm', 'castle'],
				cost: 200
			},
			saeth: {
				atk: {
					min: 55,
					max: 65
				},
				atkRange: 2,
				def: 20,
				mov: 5,
				modelName: 'SaethModel',
				langKey: 'saeth',
				canFixBuilding: true,
				withoutGrave: true,
				listOccupyBuilding: ['farm', 'castle'],
				cost: 200
			},

			'saeth-heavens-fury': {
				atk: {
					min: 55,
					max: 65
				},
				atkRange: 16,
				def: 45,
				mov: 1,
				modelName: 'SaethHeavensFuryModel',
				langKey: 'saeth',
				canNotBeBuy: true
			},

			// private units
			soldier: {
				atk: {
					min: 50,
					max: 55
				},
				atkRange: 2,
				def: 5,
				mov: 5,
				modelName: 'SoldierModel',
				langKey: 'soldier',
				canFixBuilding: true,
				listOccupyBuilding: ['farm'],
				cost: 150
			},
			archer: {
				//atk: {
				//	min: 150,
				//	max: 155
				//},
				//atkRange: 7,
				atk: {
					min: 50,
					max: 55
				},
				atkRange: 3,
				def: 5,
				mov: 5,
				modelName: 'ArcherModel',
				langKey: 'archer',
				bonusAtkAgainstFly: 30,
				cost: 250
			},
			elemental: {
				atk: {
					min: 50,
					max: 55
				},
				atkRange: 2,
				def: 10,
				mov: 5,
				modelName: 'ElementalModel',
				langKey: 'elemental',
				moveType: 'flow',
				cost: 300
			},
			sorceress: {
				atk: {
					min: 40,
					max: 45
				},
				atkRange: 2,
				raiseRange: 2,
				def: 5,
				mov: 5,
				modelName: 'SorceressModel',
				langKey: 'sorceress',
				cost: 400
			},
			wisp: {
				atk: {
					min: 35,
					max: 40
				},
				atkRange: 2,
				auraRange: 3,
				def: 10,
				mov: 5,
				modelName: 'WispModel',
				langKey: 'wisp',
				bonusAtkAgainstSkeleton: 30,
				cost: 500
			},
			'dire-wolf': {
				atk: {
					min: 60,
					max: 65
				},
				atkRange: 2,
				def: 15,
				mov: 6,
				modelName: 'DireWolfModel',
				langKey: 'dire-wolf',
				poisonPeriod: 2,
				cost: 600
			},
			golem: {
				atk: {
					min: 60,
					max: 70
				},
				atkRange: 2,
				def: 30,
				mov: 5,
				modelName: 'GolemModel',
				langKey: 'golem',
				cost: 600
			},
			catapult: {
				atk: {
					min: 50,
					max: 70
				},
				atkRange: 5,
				def: 10,
				mov: 4,
				modelName: 'CatapultModel',
				langKey: 'catapult',
				cost: 700,
				canNotActionAfterMove: true,
				canDestroyBuilding: true
			},
			dragon: {
				atk: {
					min: 70,
					max: 80
				},
				atkRange: 2,
				def: 25,
				mov: 7,
				modelName: 'DragonModel',
				langKey: 'dragon',
				moveType: 'fly',
				cost: 1000
			},

			// other
			skeleton: {
				atk: {
					min: 40,
					max: 50
				},
				atkRange: 2,
				def: 2,
				mov: 5,
				modelName: 'SkeletonModel',
				langKey: 'skeleton',
				withoutGrave: true,
				canNotBeBuy: true,
				cost: 0
			},
			crystal: {
				atk: {
					min: 0,
					max: 0
				},
				atkRange: 1,
				def: 15,
				mov: 4,
				modelName: 'CrystalModel',
				langKey: 'crystal',
				canNotBeBuy: true,
				cost: 0
			}

		}
	};

}(window));