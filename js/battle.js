var BattleScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:
		//
		function BattleScene() {
			Phaser.Scene.call(this, {
				key: 'BattleScene',
			});
		},

	create: function() {
		// change the background to green
		this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
		this.startBattle();
		// // on wake event we call startBattle too
		this.sys.events.on('wake', this.startBattle, this);
	},
	startBattle: function() {
		// player character - warrior
		var warrior = new PlayerCharacter(this, 250, 50, 'lid', 1, 'Lid', 100, 20);
		this.add.existing(warrior);

		// player character - mage
		var mage = new PlayerCharacter(this, 250, 100, 'lid', 4, 'Lid2', 80, 8);
		this.add.existing(mage);

		var dragonblue = new Enemy(this, 50, 50, 'enemy', null, 'Flame', 50, 3);
		this.add.existing(dragonblue);

		var dragonOrange = new Enemy(
			this,
			50,
			100,
			'boss',
			null,
			'Cultist',
			50,
			10
		);
		this.add.existing(dragonOrange);

		// array with heroes
		this.heroes = [warrior, mage];
		// array with enemies
		this.enemies = [dragonblue, dragonOrange];
		// array with both parties, who will attack
		this.units = this.heroes.concat(this.enemies);

		this.index = -1;
		// Run UI Scene at the same time
		this.scene.run('UIScene');
	},
	nextTurn: function() {
		if (this.checkEndBattle()) {
			this.endBattle();
			return;
		}
		do {
			this.index++;
			if (this.index >= this.units.length) {
				this.index = 0;
			}
		} while (this.units[this.index].living);
		// if there are no more units, we start again from the first one

		// if its player hero
		if (this.units[this.index] instanceof PlayerCharacter) {
			this.events.emit('PlayerSelect', this.index);
		} else {
			// else if its enemy unit
			// pick random hero
			var r = Math.floor(Math.random() * this.heroes.length);
			// call the enemy's attack function
			this.units[this.index].attack(this.heroes[r]);
			// add timer for the next turn, so will have smooth gameplay
			this.time.addEvent({
				delay: 3000,
				callback: this.nextTurn,
				callbackScope: this,
			});
		}
	},
	checkEndBattle: function() {
		var victory = true;
		// if all enemies are dead we have victory
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].living) victory = false;
		}
		var gameOver = true;
		// if all heroes are dead we have game over
		for (var j = 0; j < this.heroes.length; j++) {
			if (this.heroes[j].living) gameOver = false;
		}
		return victory || gameOver;
	},
	endBattle: function() {
		// clear state, remove sprites
		this.heroes.length = 0;
		this.enemies.length = 0;
		for (var i = 0; i < this.units.length; i++) {
			// link item
			this.units[i].destroy();
		}
		this.units.length = 0;
		// sleep the UI
		this.scene.sleep('UIScene');
		// return to WorldScene and sleep current BattleScene
		this.scene.switch('WorldScene');
	},

	receivePlayerSelection: function(action, target) {
		if (action === 'attack') {
			this.units[this.index].attack(this.enemies[target]);
		}
		this.time.addEvent({
			delay: 3000,
			callback: this.nextTurn,
			callbackScope: this,
		});
	},
});

var Unit = new Phaser.Class({
	Extends: Phaser.GameObjects.Sprite,

	initialize: function Unit(scene, x, y, texture, frame, type, hp, damage) {
		Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
		this.type = type;
		this.maxHp = this.hp = hp;
		this.damage = damage; // default damage
		this.living = true;
		this.menuItem = null;
	},
	setMenuItem: function(item) {
		this.menuItem = item;
	},
	//attack target unit
	attack: function(target) {
		if (target.living) {
			target.takeDamage(this.damage);
			this.scene.events.emit(
				'Message',
				this.type +
					' attacks ' +
					target.type +
					' for ' +
					this.damage +
					' damage'
			);
		}
	},
	takeDamage: function(damage) {
		this.hp -= damage;
		if (this.hp <= 0) {
			this.hp = 0;
			this.menuItem.unitKilled();
			this.living = false;
			this.visible = false;
			this.menuItem = null;
		}
	},
});

var Enemy = new Phaser.Class({
	Extends: Unit,

	initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		// flip the image so I don't have to edit it manually
		// this.flipX = true;
	},
});

var PlayerCharacter = new Phaser.Class({
	Extends: Unit,

	initialize: function PlayerCharacter(
		scene,
		x,
		y,
		texture,
		frame,
		type,
		hp,
		damage
	) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		// this.setScale(2);
	},
});

var MenuItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize: function MenuItem(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, {
			color: '#ffffff',
			align: 'left',
			fontSize: 15,
		});
	},

	select: function() {
		this.setColor('#f8ff38');
	},

	deselect: function() {
		this.setColor('#ffffff');
	},
	// when the associated enemy or player unit is killed
	unitKilled: function() {
		this.active = false;
		this.visible = false;
	},
});

var Menu = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Menu(x, y, scene, heroes) {
		Phaser.GameObjects.Container.call(this, scene, x, y);
		this.menuItems = [];
		this.menuItemIndex = 0;
		this.heroes = heroes;
		this.x = x;
		this.y = y;
	},
	addMenuItem: function(unit) {
		var menuItem = new MenuItem(
			0,
			this.menuItems.length * 20,
			unit,
			this.scene
		);
		this.menuItems.push(menuItem);
		this.add(menuItem);
		return menuItem;
	},
	moveSelectionUp: function() {
		this.menuItems[this.menuItemIndex].deselect();
		do {
			this.menuItemIndex--;
			if (this.menuItemIndex < 0)
				this.menuItemIndex = this.menuItems.length - 1;
		} while (!this.menuItems[this.menuItemIndex].active);
		this.menuItems[this.menuItemIndex].select();
	},
	moveSelectionDown: function() {
		this.menuItems[this.menuItemIndex].deselect();
		do {
			this.menuItemIndex++;
			if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
		} while (!this.menuItems[this.menuItemIndex].active);
		this.menuItems[this.menuItemIndex].select();
	},
	// select the menu as a whole and an element with index from it
	select: function(index) {
		if (!index) index = 0;
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = index;
		while (!this.menuItems[this.menuItemIndex].active) {
			this.menuItemIndex++;
			if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
			if (this.menuItemIndex === index) return;
		}
		this.menuItems[this.menuItemIndex].select();
		this.selected = true;
	},
	// deselect this menu
	// deselect this menu
	deselect: function() {
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = 0;
		this.selected = false;
	},
	confirm: function() {
		// wen the player confirms his slection, do the action
	},

	clear: function() {
		for (var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].destroy();
		}
		this.menuItems.length = 0;
		this.menuItemIndex = 0;
	},
	remap: function(units) {
		this.clear();
		for (var i = 0; i < units.length; i++) {
			var unit = units[i];
			unit.setMenuItem(this.addMenuItem(unit.type));
		}
		this.menuItemIndex = 0;
	},
});

var HeroesMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function HeroesMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
	},
});

var ActionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function ActionsMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
		this.addMenuItem('Attack');
	},
	confirm: function() {
		this.scene.events.emit('SelectedAction');
	},
});

var EnemiesMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function EnemiesMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
	},
	confirm: function() {
		this.scene.events.emit('Enemy', this.menuItemIndex);
	},
});

var UIScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:
		//
		function UIScene() {
			Phaser.Scene.call(this, {
				key: 'UIScene',
			});
		},

	create: function() {
		this.graphics = this.add.graphics();
		this.graphics.lineStyle(1, 0xffffff);
		this.graphics.fillStyle(0x031f4c, 1);
		this.graphics.strokeRect(2, 150, 90, 100);
		this.graphics.fillRect(2, 150, 90, 100);
		this.graphics.strokeRect(95, 150, 90, 100);
		this.graphics.fillRect(95, 150, 90, 100);
		this.graphics.strokeRect(188, 150, 130, 100);
		this.graphics.fillRect(188, 150, 130, 100);
		// basic container to hold all menus
		this.menus = this.add.container();

		this.heroesMenu = new HeroesMenu(195, 153, this);
		this.actionsMenu = new ActionsMenu(100, 153, this);
		this.enemiesMenu = new EnemiesMenu(8, 153, this);

		// the currently selected menu
		this.currentMenu = this.actionsMenu;

		// add menus to the container
		this.menus.add(this.heroesMenu);
		this.menus.add(this.actionsMenu);
		this.menus.add(this.enemiesMenu);

		this.battleScene = this.scene.get('BattleScene');

		this.input.keyboard.on('keydown', this.onKeyInput, this);

		this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

		this.events.on('SelectedAction', this.onSelectedAction, this);

		this.events.on('Enemy', this.onEnemy, this);

		// when the scene receives wake event
		this.sys.events.on('wake', this.createMenu, this);

		this.message = new Message(this, this.battleScene.events);
		this.add.existing(this.message);

		this.createMenu();
	},

	createMenu: function() {
		this.remapHeroes();
		this.remapEnemies();
		this.battleScene.nextTurn();
	},
	onEnemy: function(index) {
		this.heroesMenu.deselect();
		this.actionsMenu.deselect();
		this.enemiesMenu.deselect();
		this.currentMenu = null;
		this.battleScene.receivePlayerSelection('attack', index);
	},

	onPlayerSelect: function(id) {
		this.heroesMenu.select(id);
		this.actionsMenu.select(0);
		this.currentMenu = this.actionsMenu;
	},

	onSelectedAction: function() {
		this.currentMenu = this.enemiesMenu;
		this.enemiesMenu.select(0);
	},

	remapHeroes: function() {
		var heroes = this.battleScene.heroes;
		this.heroesMenu.remap(heroes);
	},
	remapEnemies: function() {
		var enemies = this.battleScene.enemies;
		this.enemiesMenu.remap(enemies);
	},

	onKeyInput: function(event) {
		if (this.currentMenu && this.currentMenu.selected) {
			if (event.code === 'ArrowUp') {
				this.currentMenu.moveSelectionUp();
			} else if (event.code === 'ArrowDown') {
				this.currentMenu.moveSelectionDown();
			} else if (event.code === 'ArrowRight' || event.code === 'Shift') {
			} else if (event.code === 'Space' || event.code === 'ArrowLeft') {
				this.currentMenu.confirm();
			}
		}
	},
});

var Message = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize:
		//
		function Message(scene, events) {
			Phaser.GameObjects.Container.call(this, scene, 160, 30);
			var graphics = this.scene.add.graphics();
			this.add(graphics);
			graphics.lineStyle(1, 0xffffff, 0.8);
			graphics.fillStyle(0x031f4c, 0.3);
			graphics.strokeRect(-90, -15, 180, 30);
			graphics.fillRect(-90, -15, 180, 30);
			this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
				color: '#ffffff',
				align: 'center',
				fontSize: 13,
				wordWrap: {
					width: 160,
					useAdvancedWrap: true,
				},
			});
			this.add(this.text);
			this.text.setOrigin(0.5);
			events.on('Message', this.showMessage, this);
			this.visible = false;
		},
	showMessage: function(text) {
		this.text.setText(text);
		this.visible = true;
		if (this.hideEvent) this.hideEvent.remove(false);
		this.hideEvent = this.scene.time.addEvent({
			delay: 2000,
			callback: this.hideMessage,
			callbackScope: this,
		});
	},
	hideMessage: function() {
		this.hideEvent = null;
		this.visible = false;
	},
});

// resize();
// window.addEventListener('resize', resize, false);

// // function to resize game screen to be responsive to screen size
// function resize() {
// 	let canvas = document.querySelector('canvas');
// 	let windowWidth = window.innerWidth;
// 	let windowHeight = window.innerHeight;
// 	let windowRatio = windowWidth / windowHeight;
// 	let gameRatio = game.config.width / game.config.height;
// 	if (windowRatio < gameRatio) {
// 		canvas.style.width = windowWidth + 'px';
// 		canvas.style.height = windowWidth / gameRatio + 'px';
// 	} else {
// 		canvas.style.width = windowHeight * gameRatio + 'px';
// 		canvas.style.height = windowHeight + 'px';
// 	}
// }