(function (win) {

	"use strict";
	/*global window */

	win.langs = win.langs || {};

	win.langs.en = {
		language: 'language',
		languageName: 'english',
		objective: 'Objective:',
		thanks: 'Programmer:<br>Dmitry Turovtsov<br><br>Thanks:<br>Pavel Prylutski<br>Igor Kupreev<br>Pavel Sychykau',
		units: {
			archer: {
				name: 'archer',
				description: 'With their powerful bows archers can attack from a distance and are especially powerful against airborne enemies.'
			},
			bones: {
				name: 'bones',
				description: 'Summoned by Wizards, these lifeless warriors are as strong as soldiers and deadly opponents on any battlefield.'
			},
			catapult: {
				name: 'catapult',
				description: 'Catapults bring devastation wherever they go with their enormous attack range. However, their relative immobility and inability to attack up close make them vulnerable so guard them well. Catapults can either move or attack during a turn, but not do both.'
			},
			golem: {
				name: 'golem',
				description: 'Forged out of living rock by the dwarf tribes of the Lost Mountains, Golems are slow but immensely strong in defence. A golem stationed in a building or a well defended mountain is very difficult to defeat.'
			},
			knight: {
				name: 'knight',
				description: 'The Knight is very strong in attack and defence. Knight can also occupy farms and castles to produce troops and can be revived in the castle if they fall in battle.'
			},
			lizard: {
				name: 'lizard',
				description: 'Descendants of the ancient amphibian empire spanning the marshlands in the east Lizards are proud warriors. They are immensely mobile (+3) and stronger in defence (+2) when in water.'
			},
			soldier: {
				name: 'soldier',
				description: 'Hardworking and brave, soldiers form the backbone of any army. They are also the only unit that can capture farms to earn gold.'
			},
			spider: {
				name: 'spider',
				description: 'Spiders are dangerous creatures whose natural habitat spans the unforgiving dark forests of the west. In addition to being highly mobile, spiders use a poisoned attack to weaken their opponents for one turn.'
			},
			wisp: {
				name: 'wisp',
				description: 'These mystical beings of pure light radiate an aura which adds attack points to nearby friendly units. In close combat they are especially deadly against skeletons.'
			},
			wizard: {
				name: 'wizard',
				description: 'The ancient guild of wizards are weak at close combat, but immensely useful as they can summon fighting skeletons from dead troops.'
			},
			wyvern: {
				name: 'wyvern',
				description: 'These majestic flying beasts have ruled over the mountains of mist since ancient times. They are extremely mobile as well as deadly in attack on land, air and sea.'
			}
		},
		instructions: [
			'Ancient Empires is a thrilling strategy game putting you in the role of King Galamar as you fight to reclaim your kingdom.',
			'The flashing red/blue marks the movement range of a unit. A unit\'s range is determined by its type and the terrain it is on.',
			'Different types of terrain affect a unit\'s ability to move, attack and defend. For example, mountains add defence points but slow units down. When you tap to these terrain features appear at the bottom of the screen.',
			'When a unit has completed a move, unit becomes translucent. This means that it cannot be moved again until your next turn.',
			'You can move each unit only once each turn.',
			'Use \'+\' and \'-\' buttons (bottom-right corner) to scale map',
			'You can view the characteristics of any unit in store. Units get more powerful as they gain battle experience.',
			'To attack an enemy unit, move your unit within range and select \'attack\' icon. If there is more than one enemy in range, select which unit to attack. The success of your attack is determined by unit characteristics and terrain.',
			'Only a knight can occupy a castle. You can purchase new units with gold in castle.',
			'You can occupy buildings by moving a soldier onto it and selecting \'occupy\' icon. Once a building is occupied, it changes colour.',
			'Once a building has been occupied, it earns gold. The more buildings you occupy, the more you earn.',
			'Units can be healed by occupying buildings. The longer a unit stays, the more life it regains.',
			'Lizards are amphibious, giving them increased movement and defence when in water.',
			'A spider\'s attack is poisonous. A poisoned unit is weak for its next turn.',
			'A tombstone shows where a unit has been defeated. It disappears after 1 turn.',
			'Wizards have the power to summon skeleton warriors from the graves of fallen soldiers. After a unit has been defeated, a tombstone appears for 1 turn. Move a wizard next to a tombstone and select \'raise\' icon.',
			'Use wisps to provide nearby friendly units with an aura that augments their attack points.',
			'Keep your wyverns away from enemy archers, as they are vulnerable to arrows!'
		],
		missions: {
			c01_regroup: {
				A1Header: 'Chapter 1',
				A1: 'The Kingdom of Thorin is divided. Betrayed by his own twin brother Valadorn, King Galamar has fled into the borderlands of the east. Only the Blue guard, Galamar\'s personal troops, have remained loyal and stand ready to reclaim the land...',
				H1: 'Sire, your troops are weary after last night\'s battle. It would be wise to regroup at the abandoned castle.',
				G1: 'Sound advice, captain. Ready the troops - we should not let the enemy catch us unprepared.',
				H2: 'Valadorn\'s army should be easy to spot with their red uniforms.',
				T1: '[] King Galamar must occupy castle.%%%%[] Keep all troops alive.',
				H3: 'Spies!! Valadorn and his Red legion must know where we are! Quickly, protect the King!',
				objective: '[] King Galamar must occupy castle.%%%%[] Keep all troops alive.',
				'Keep all troops alive': 'Keep all troops alive'
			},
			c02_friendsAndEnemies: {
				A1Header: 'Chapter 2',
				A1: 'King Galamar has survived Valadorn\'s attack. However, before Galamar can try to reclaim his kingdom he must first travel north to seek new allies.',
				G1: 'Forward, troops. But first, occupy these two buildings. We can rest once we reach the next village.',
				T1: '[] Keep the knight.%%%%[] Occupy the castle and at least one village.%%%%[] Produce at least three new unit of troops.',

				H1: 'Sire, our scouts report that the lizard people of the north are under attack!',
				G2: 'Then we must act quickly! The Lizard Chief is an old ally, and he will be sure to help us if we can save him.',

				H2: 'Sire, these lizards bring news from their village. They are under attack from forest spiders!',

				G3: 'Spiders? Then we will have to use the terrain to our advantage - rushing to attack would be foolish.',
				H3: 'Be careful your majesty - the spiders attack is poisonous!',
				objective: '[] Keep the knight.%%%%[] Occupy the castle and at least one village.%%%%[] Produce at least three new unit of troops.',
				'Keep the knight': 'Keep the knight'
			},
			c03_escort: {
				A1Header: 'Chapter 3',
				A1: 'The Lizard Chief agrees to join Galamar\'s forces. Now Galamar\'s thoughts turn to the wizards of the Grey Tower. If the Lizard Chief can persuade them to help, their magic would be a great asset to his growing forces.',
				H1: 'Sire, the bridge has been destroyed!',
				G1: 'Valadorn must be expecting us - we must find another way across. This could be a trap.',
				H2: 'Troops! Keep your eyes open and protect the Lizard Chief at all cost.',
				//T1: 'Galamar and the Lizard Chief must reach the Grey Tower.',
				T1: '[] Occupy the castle.%%%%[] Keep the knight.%%%%[] Keep the Lizard Chief.',
				objective: '[] Occupy the castle.%%%%[] Keep the knight.%%%%[] Keep the Lizard Chief.',
				'Keep the knight': 'Keep the knight',
				'Keep the Lizard Chief': 'Keep the Lizard Chief'
			},
			c04_reinforcements: {
				A1Header: 'Chapter 4',
				A1: 'Having reached the Grey Tower the High Wizard agrees to help Galamar. However, Galamar\'s troops have no time to rest, as a message arrives from the nearby city of Var Telan, telling of a surprise attack by Valadorn\'s Red legion.',
				H1: 'Your majesty, the Red legion! Watch out for their long range catapult!',
				T1: '[] Keep the knight.%%%%[] Save the city: destroy all enemy units!%%%%[] Occupy the castle.',
				H2: 'What is this treachery! The city has turned against us!',
				V1: 'As predictable as ever, brother! I have you now!',
				V2: 'Retreat!! Curse you Galamar! You won\'t be so lucky next time!',
				objective: '[] Keep the knight.%%%%[] Save the city: destroy all enemy units!%%%%[] Occupy the castle.',
				'Keep the knight': 'Keep the knight'
			},
			c05_wyvernRescue: {
				A1Header: 'Chapter 5',
				A1: 'As Galamar\'s forces settle into the city castle, a scout patrol discovers some flying serpents called wyverns being held captive at an enemy campsite nearby. Could the wyverns be used against Valadorn and his forces? To find out, Galamar will have to rescue them.',
				G1: 'Sources indicate that the wyverns are being held in this castle.',
				H1: 'Be careful, your Majesty, wyverns can be formidable enemies as well as powerful allies.',
				T1: '[] Occupy the castle.%%%%[] Destroy all enemy units and free the wyverns.%%%%[] Keep the knight.',
				H2: 'Look your Majesty, the wyverns have broken free! They are now under our command!',
				objective: '[] Occupy the castle.%%%%[] Destroy all enemy units and free the wyverns.%%%%[] Keep the knight.',
				'Keep the knight': 'Keep the knight'
			},
			c06_siege: {
				A1Header: 'Chapter 6',
				A1: 'With the powerful wyverns adding to his forces, Galamar is ready to fight back against Valadorn. He decides to mount a surprise attack on the main command outpost outside Thorin city.',
				H1: 'The city is well defended, your Majesty.',
				G1: 'So it seems. We may have to alter our battle plan.',
				T1: '[] Destroy all enemy units.%%%%[] Occupy the enemy castle.%%%%[] Keep the knight.',
				objective: '[] Destroy all enemy units.%%%%[] Occupy the enemy castle.%%%%[] Keep the knight.',
				'Keep the knight': 'Keep the knight'
			},
			c07_finalAssault: {
				A1Header: 'Chapter 7',
				A1: 'Galamar is on the verge of recapturing the city when suddenly a huge explosion splits the ground.',
				G1: 'Valadorn\'s troops appearing everywhere?! What kind of evil magic is this?',
				V1: 'So, twin brother, it seems our positions are reversed! Submit now or be destroyed!',
				G2: 'Never! Whatever dark power is controlling you, I will defeat it!',
				T1: '[] Destroy all enemy units and save the kingdom!%%%%[] Keep the knight.',
				V2: 'Galamar... what have I done?',
				G3: 'The spell! It\'s broken!',
				A2: 'With Galamar victorious, the spell controlling Valadorn is broken. The evil force is none other than Saeth, the shadow demon! His plan defeated, with a terrible roar he orders his dark army to attack Galamar. Will the newly united Kingdom of Thorin withstand this attack? Can Galamar and his brother banish the evil Saeth once and for all?',
				objective: '[] Destroy all enemy units and save the kingdom!%%%%[] Keep the knight.',
				'Keep the knight': 'Keep the knight'
			}
		}

	};

}(window));