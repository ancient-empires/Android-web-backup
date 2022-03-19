/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function (win) {

	"use strict";
	/*global window */
	/*global APP */

	win.APP = win.APP || {};

	APP.languages = APP.languages || {};

	APP.languages.es = {
		language: 'Lengua',
		languageName: 'Español',
		shortLanguageName: 'Spa',
		appName: 'AE2FG',

		//theme: 'Theme',
		//share: 'Share',

		// title page
		play: 'Jugar',
		online: 'En linea',
		settings: 'Opciones',
		instructions: 'Instrucciones',
		about: 'Acerca de',

		// settings
		on: 'si',
		off: 'no',
		music: 'musica',
		vibrate: 'vibración',
		help: 'ayuda',
		youCanDisableHelpNotification: 'Puedes desactivar la notificación de ayuda en \'Opciones\'',
		fightAnimation: 'animación de batalla',
		gameSpeed: 'velocidad de juego',
		confirmTurn: 'confirmar turno',
		confirmMove: 'confirmar movimiento',
		confirmAttack: 'confirmar ataque',
		'gameSpeed-1': 'muy lento',
		'gameSpeed-2': 'lento',
		'gameSpeed-3': 'normal',
		'gameSpeed-4': 'rapido',
		'gameSpeed-5': 'muy rapido',
		mainSettings: 'Ajustes opciones',
		gameDifficulty: 'Dificultad de juego',
		font: 'Fuente',
		easy: 'facil',
		normal: 'normal',
		hard: 'difícil',
		buildingSmoke: 'humo en casa',
		unitAnimation: 'animación de unidad',
		autoSave: 'ahorro automático',

		// play
		companies: 'Compañia',
		loadGame: 'Cargar partida',
		selectLevel: 'Seleccionar nivel',
		skirmish: 'Escaramuza',
		userMaps: 'Mapas de los usuarios',
		userMap: 'Mapa del usuario',
		mission: 'Misión',

		// setup skirmish
		player: 'Jugador',
		cpu: 'CPU',
		none: 'Ninguno',
		money: 'Fondos',
		unitLimit: 'Limite de unidades',
		fight: 'Pelea',
		team: 'Equipo',

		// colors
		blue: 'azúl',
		red: 'rojo',
		green: 'verde',
		black: 'negro',

		rateUs: {
			header: 'Valoranos por favor!',
			notNow: 'Ahora no',
			fiveStars: 'Si, 5 estrellas!'
		},

		// unit store
		unitStoreHeader: 'Unidades',

		// popups
		endTurnQuestion: 'Terminar turno?',
		yes: 'Si',
		no: 'No',
		ok: 'De acuerdo',
		continue: 'Continuar',
		congratulations: 'Felicidades!',
		gameSaved: 'Juego guardado',
		unlocked: 'desbloqueado!',

			//save/load popup
		save: 'Guardar',
		delete: 'Borrar',
		replace: 'Remplazar',
		saveGame: 'Guardar juego',
		areYouSureToDeleteSavedGame: '¿Desea borrar el juego guardado?',
		areYouSureToLoadGame: '¿Desea cargar partida?',
		noSavedGames: 'No guardar juego',
		load: 'Cargando',

			// end game
		blackDefeat: 'Jugador negro fue derrotado!',
		blueDefeat: 'Jugador azúl fue derrotado!',
		greenDefeat: 'Jugador verde fue derrotado!',
		redDefeat: 'Jugador rojo fue derrotado!',
		victory: 'Victoria!',
		defeat: 'Derrota!',
		missionComplete: 'Misión cumplida!',
		restartBattle: 'Reanudar',
		quitBattle: 'Salir',
		areYouSureToQuitBattle: '¿Seguro quiere abandonar batalla?',
		areYouSureToRestartBattle: '¿Seguro quiere reanudar batalla?',

			// notification
		objective: 'Objetivo',
		skirmishObjective: 'Derrota al comandante enemigo y ocupa todos sus castillos!',
		newTurn: 'Nuevo turno!',
		income: 'Ingreso',
		tooMuchUnits: 'Unidades demasiado!',

			//battle menu
		menu: 'Menú',

		// map editor
		mapEditor: 'Editor de mapas',
		maps: 'Mapas',
		width: 'Anchura',
		height: 'Altura',
		name: 'Nombre',
		colors: 'Colores',
		open: 'Abierto',
		clean: 'Limpio',
		exit: 'Salida',
		areYouSureToLeaveMapEditor: '¿Seguro que salir editor de mapas?',
		unsavedMapProgressWillBeLost: 'Mapa de progreso no se haya guardado se perderá!',
		noSavedMaps: 'No hay mapas guardados',
		youAreSureToDeleteMap: 'Usted está seguro de eliminar mapa?',
		mapHasBeenSaved: 'mapa ha sido guardado.',
		mapHasBeenDeleted: 'mapa ha sido eliminado.',
		cleanMapNotSavedDataWillBeLost: 'Mapa Clean? No se perderán los datos guardados.',
		needMoreUnitsOrBuildings: 'Necesitas más unidades o edificios',
		enterMapName: 'Ingrese nombre del mapa',
		mapName: 'Nombre del mapa',

		// other
		disableAllTips: 'Desactivar TODAS consejos',

		//aboutText: '<br><br><br>Ancient Empire: Strike Back.<br><br><br><!--Programmer:<br>Dmitry Turovtsov<br><br>Thanks:<br>Alexey Danilov<br>Pavel Prylutski<br>Igor Kupreev<br>Pavel Sychykau-->',
		aboutText: '<br><br><br>Ancient Empire:<br>Strike Back<br><br><br>',
		instructionsText: [
			'\'Ancient Empire: Strike Back\' es un juego de estrategia emocionante que te permite controlar Rey Galamar y su hermano Valadorn mientras luchan para proteger su reino del mal.',
			'A continuación se muestran las instrucciones, consejos y sugerencias sobre cómo jugar, que también aparecen en el juego.',
			'Los cuadros rojos marcan el rango de movimiento de una unidad. El rango de una unidad se determina por su tipo y el terreno que se encuentra.',
			'Los diferentes tipos de terreno afectan la capacidad de una unidad para moverse, atacar y defender. Por ejemplo, las montañas añaden puntos de defensa, pero reducen el movimiento. Al mover el cursor estas características del terreno aparecen estas caracteristicas en la parte inferior de la pantalla.',
			'Cuando una unidad ha completado un movimiento, cambiará a gris. Esto significa que no puede ser utilizado de nuevo hasta su próximo turno.',
			'Puede mover cada unidad sólo una vez cada turno. Cuando haya terminado de mover todas sus unidades toque \'terminar turno\'.',
			'Las unidades se vuelven mas poderosas a medida que adquieren experiencia en batalla y se actualizan en rango.',
			'Puede ver el rango de ataque de cualquier unidad dando doble toque cuando se selecciona.',
			'Para atacar a una unidad enemiga, mueve tu unidad dentro del rango y selecciona \'atacar\'. En caso de haber más de un enemigo al alcanze, selecciona cuál unidad deseas atacar. El éxito de tu ataque está determinado por las características de la unidad y el terreno.',
			'Sólo un comandante puede ocupar un castillo. Una vez que un castillo es ocupado puedes adquirir nuevas unidades con tu oro. El comandante no necesita permanecer en el castillo para adquirir unidades.',
			'Puedes ocupar edificios moviendo a un soldado o comandante dentro de ellos y seleccionando "ocupar". Una vez un edificio es ocupado, cambia su color. Si un edificio es dañado tendrás que repararlo antes de que pueda ser ocupado.',
			'Una vez que un edificio ha sido ocupado, generará oro. Mientras más edificios ocupes, más oro recibirás',
			'Las unidades pueden ser curadas en los edificios de tu propiedad. Mientras más tiempo pase una unidad en el edificio, será mayor la energía que recuperará. ',
			'Si un comandante es derrotado en batalla, puede ser revivido en un castillo.',
			'Los elementales son anfibios, lo que les da un incremento de movimiento, ataque y defensa mientras permanescan en el agua.',
			'Un ataque hecho por lobos es venenoso. Una unidad envenenada es lenta y débil hasta su siguiente turno.',
			'Una hechicera tiene el poder para invocar guerreros esqueleto de las tumbas de las unidades caídas. Después que una unidad ha sido derrotada, una lápida aparece por un turno. Mueve a la hechicera al lado de una lápida y selecciona \'resucitar\'.',
			'Usa los fragmentos para proporcionar a tus unidades cercanas un aura que aumenta sus puntos de ataque.',
			'La catapulta tiene la habilidad para destruir edificios enemigos e interrumpir su flujo de recursos.',
			'Mantén a tus dragones lejos de arqueros enemigos, ¡ellos son vulnerables a las flechas!'
		],
		helpList: [
			// 0
			{
				img: 'img/help/select-unit.png',
				text: ['Para seleccionar una unidad toca (<img src="img/help/tap-finger.png" class="icon-in-text" />) a la unidad.', '<img src="img/help/finger-on-red-square.png" class="icon-in-text" /> - Los cuadros rojos marcan el rango de movimiento de la unidad.', 'El rango de la unidad está determinado por su tipo y el terreno en el que se encuentre.']
			},
			// 1
			{
				//img: 'img/help/occupy-castle.png',
				text: ['Para atacar a una unidad enemiga, mueve tu unidad dentro del rango y selecciona <img src="img/help/attack-icon.png" class="icon-in-text" />.', 'Si hay más de un enemigo en rango, selecciona que unidad atacar. El éxito de tu ataque está determinado por las caracteristicas de tu unidad y el terreno.']
			},
			// 2
			{
				//img: 'img/help/occupy-farm.png',
				text: ['Sólo un Comandante puede ocupar (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />) un castillo.', 'Una vez que un castillo es ocupado puedes reclutar nuevas unidades con tu oro.', 'El Comandante no necesita permanecer en el castillo para reclutar unidades.']
			},
			// 3
			{
				img: 'img/help/raise.png',
				text: ['Puedes ocupar edificios moviendo a un soldado o comandante dentro de ellos y seleccionando \'ocupar\' (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />).', 'Una vez un edificio es ocupado, cambia su color.', 'Si un edificio es dañado tendrás que repararlo (<img src="img/help/fix-building-icon.png" class="icon-in-text" />) antes de que pueda ser ocupado.']
			},
			// 4
			{
				img: 'img/help/raise.png',
				text: ['Puedes ocupar edificios moviendo a un soldado o comandante dentro de ellos y seleccionando \'ocupar\' (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />).', 'Una vez un edificio es ocupado, cambia su color.', 'Si un edificio es dañado tendrás que repararlo (<img src="img/help/fix-building-icon.png" class="icon-in-text" />) antes de que pueda ser ocupado.']
			}
		],
		unitsList: {
			'soldier': {
				name: 'Soldado',
				description: 'Los soldados son sólidos y completos guerreros que forman la columna vertebral de cualquier ejército. Los soldados son también la unica unidad que puede capturar edificios para obtener oro.'
			},
			'archer': {
				name: 'Arquero',
				description: 'Con sus poderosos arcos los arqueros puede atacar desde la distancia y son especialmente poderosos contra enemigos voladores.'
			},
			'elemental': {
				name: 'Elemental',
				description: 'Los elementales son espíritus magicos del agua. Cuando están en el agua, los elementales tienen un mayor movimiento y una defensa aumentada.'
			},
			'sorceress': {
				name: 'Hechicera',
				description: 'Habilidosa en el uso de la magia. Las hechiceras son débiles en combate cercano. Sin embargo, su habilidad para invocar guerreros esqueleto de las tropas derrotadas puede ser decisiva en batalla.'
			},
			'wisp': {
				name: 'Fragmento',
				description: 'Estos seres míticos de luz pura irradian un aura que aumenta las habilidades de ataque de las unidades cercanas. En combate a corta distacia son especialmente mortales contra los guerreros esqueleto.'
			},
			'dire-wolf': {
				name: 'Lobos Mortales',
				description: 'Los lobos mortales son feroces cazadores que viajan en manada. Ten cuidado - su mordida es venenosa y reduce los niveles de ataque y defensa por un turno.'
			},
			'golem': {
				name: 'Golem',
				description: 'Los golem son seres antiguos - lentos pero inmensamente poderosos en defensa. Un golem posicionado en un edificio o una montaña es muy difícil de derrotar.'
			},
			'catapult': {
				name: 'Catapulta',
				description: 'Las catapultas proclaman un rastro de destrucción con su enorme rango de ataque. Sin embargo, su relativa inmovilidad y inhabilidad para atacar a corta distancia las hace vulnerables, así que resguardalas bien. Las catapultas pueden moverse así como atacar durante un turno, pero no las dos cosas al mismo tiempo.'
			},
			'dragon': {
				name: 'Dragón',
				description: 'Estas masivas bestias voladoras han reinado sobre las montañas de niebla desde tiempos antiguos. Son extremadamente ágiles y mortales tanto en tierra como aire y mar.'
			},
			'skeleton': {
				name: 'Esqueletos',
				description: 'Invocados por Hechiceras, estos guerreros sin vida son tan fuertes como los soldados y mortales oponentes sobre cualquier campo de batalla.'
			},
			'galamar': {
				name: 'Galamar',
				description: 'Galamar (comandante) es muy fuerte en ataque y defensa. Los comandantes también pueden ocupar castillos para producir tropas y pueden ser revividos en el castillo si caen en batalla.'
			},
			'valadorn': {
				name: 'Valador',
				description: 'Valador (comandante) es muy fuerte en ataque y defensa. Los comandantes también pueden ocupar castillos para producir tropas y pueden ser revividos en el castillo si caen en batalla.'
			},
			'demon-lord': {
				name: 'Señor de los demonios',
				description: 'Señor de los demonios (comandante) es muy fuerte en ataque y defensa. Los comandantes también pueden ocupar castillos para producir tropas y pueden ser revividos en el castillo si caen en batalla.'
			},
			'saeth': {
				name: 'Saeth',
				description: 'Saeth (comandante) es muy fuerte en ataque y defensa. Los comandantes también pueden ocupar castillos para producir tropas y pueden ser revividos en el castillo si caen en batalla.'
			},
			'crystal': {
				name: 'Cristal',
				description: 'Estos legendarios cristales fueron recuperados originalmente de las ruinas de la Antigua Ciudadela. Poco se sabe de su poder, excepto que se rumora que protegen el reino, aunque también poseen el poder para destruirlo.'
			}
		},

		story: {
			list: [
				// 0
				'img/story/story-1-1.png_!_Con el paso de la guerra contra las fuerzas de la oscuridad. Los hermanos Galamar y Valador están reunidos en sus dominios, el reino de Thorin. El reino se recupera lentamente retornando a sus tiempos de paz, protegido por tres antiguos cristales resguardados a salvo en los templos del Coraje, Sabiduría y Vida, fue entonces cuando rumores acerca de escaramuzas en el norte alcanzaron el palacio...',
				// 1
				'img/story/story-1-2.png_!_\'Y tres era su número, tres para proteger, tres para destruir. Misericordia a aquel portador de su poder, misericordia sobre nuestras almas, para aquel que liberará el fuego celestial sobre este mundo.\'<br \/>[Verso 3:7 de las Profecias del Cristal, autor desconocido, traducido del único expediente sobreviviente de la Era de las Tinieblas.',
				// 2
				'img/story/story-1-3.png_!_Un mensajero de El Templo del Coraje llegó a las puertas del castillo, súplicando por la ayuda del rey - El templo ha caído preso por unos atacantes brutales, y debe ser protegido... ',
				// 3
				'img/story/story-4-1.png_!_Con la ayuda de los Elementales, El rey Galamar finalmente alcanza El Templo de la Vida un paso antes que el enemigo...',
				// 4
				'img/story/story-8-1.png_!_Galamar y Valador siguen el camino de destrucción dejado atrás por el dragón y se encuentran en las ruinas de la Antigua Ciudadela...',
				// 5
				'img/story/story-8-2.png_!_\'Y la tierra temblará, y los cielos llorarán. Aquel que destruya será destruido, Aquel que arrebate le será arrebatado. Y una nueva era, libre de maldad y obscuridad nacerá.\' <br />[Verso final de las Profecias del Cristal, autor desconocido, nunca traducido, perdido durante la Era de las Tinieblas]'
			]
		}

	};

}(window));