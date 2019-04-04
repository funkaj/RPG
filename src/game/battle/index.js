import Phaser from 'phaser';
import Enemy from './enemy';
import PlayerCharacter from './playerCharacter';
import HeroesMenu from './battleMenu/heroMenu';
import EnemiesMenu from './battleMenu/enemiesMenu';
import ActionsMenu from './battleMenu/actionsMenu';

export const BattleScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function BattleScene() {
		Phaser.Scene.call(this, { key: 'BattleScene' });
	},
	create: function() {
		// change the background to green
		this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

		this.startBattle();
		// on wake event we call startBattle too
		this.sys.events.on('wake', this.startBattle, this);
	},
	startBattle: function() {
		// player character - warrior
		var warrior = new PlayerCharacter(
			this,
			250,
			50,
			'player',
			'idle/left/0001.png',
			'Lid',
			1,
			100,
			20
		);
		this.anims.play('idle-lid-battle', warrior);
		this.add.existing(warrior);

		// player character - mage
		var mage = new PlayerCharacter(
			this,
			250,
			100,
			'beryl',
			'401004807_idle_0001.png',
			'Beryl',
			4,
			80,
			8
		);
		this.anims.play('idle', mage);
		this.add.existing(mage);

		var cultist = new Enemy(
			this,
			50,
			50,
			'cultist',
			'disciple-45x51_01.png',
			'Cultist',
			null,
			10,
			3
		);
		this.add.existing(cultist);

		var flame = new Enemy(
			this,
			50,
			100,
			'flame',
			'flameball-32x32_01.png',
			'Flame',
			null,
			8,
			3
		);
		this.anims.play('idle-flame', flame);
		this.add.existing(flame);

		// array with heroes
		this.heroes = [warrior, mage];
		// array with enemies
		this.enemies = [cultist, flame];
		// array with both parties, who will attack
		this.units = this.heroes.concat(this.enemies);

		this.index = -1; // currently active unit

		this.scene.run('UIScene');
	},
	nextTurn: function() {
		// if we have victory or game over
		if (this.checkEndBattle()) {
			this.endBattle();
			return;
		}
		do {
			// currently active unit
			this.index++;
			// if there are no more units, we start again from the first one
			if (this.index >= this.units.length) {
				this.index = 0;
			}
		} while (!this.units[this.index].living);
		// if its player hero
		if (this.units[this.index] instanceof PlayerCharacter) {
			// we need the player to select action and then enemy
			this.events.emit('PlayerSelect', this.index);
		} else {
			// else if its enemy unit
			// pick random living hero to be attacked
			var r;
			do {
				r = Math.floor(Math.random() * this.heroes.length);
			} while (!this.heroes[r].living);
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
	// check for game over or victory
	checkEndBattle: function() {
		var victory = true;
		// if all enemies are dead we have victory
		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].living) victory = false;
		}
		var gameOver = true;
		// if all heroes are dead we have game over
		// eslint-disable-next-line no-redeclare
		for (var i = 0; i < this.heroes.length; i++) {
			if (this.heroes[i].living) gameOver = false;
		}
		return victory || gameOver;
	},
	// when the player have selected the enemy to be attacked
	receivePlayerSelection: function(action, target) {
		// eslint-disable-next-line eqeqeq
		if (action == 'attack') {
			this.units[this.index].attack(this.enemies[target]);
		}
		// next turn in 3 seconds
		this.time.addEvent({
			delay: 3000,
			callback: this.nextTurn,
			callbackScope: this,
		});
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
});

// User Interface scene
export const UIScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function UIScene() {
		Phaser.Scene.call(this, { key: 'UIScene' });
	},

	create: function() {
		// draw some background for the menu
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

		// listen for keyboard events
		this.input.keyboard.on('keydown', this.onKeyInput, this);

		// when its player cunit turn to move
		this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

		// when the action on the menu is selected
		// for now we have only one action so we dont send and action id
		this.events.on('SelectedAction', this.onSelectedAction, this);

		// an enemy is selected
		this.events.on('Enemy', this.onEnemy, this);

		// when the scene receives wake event
		this.sys.events.on('wake', this.createMenu, this);

		// the message describing the current action
		this.message = new Message(this, this.battleScene.events);
		this.add.existing(this.message);

		this.createMenu();
	},
	createMenu: function() {
		// map hero menu items to heroes
		this.remapHeroes();
		// map enemies menu items to enemies
		this.remapEnemies();
		// first move
		this.battleScene.nextTurn();
	},
	onEnemy: function(index) {
		// when the enemy is selected, we deselect all menus and send event with the enemy id
		this.heroesMenu.deselect();
		this.actionsMenu.deselect();
		this.enemiesMenu.deselect();
		this.currentMenu = null;
		this.battleScene.receivePlayerSelection('attack', index);
	},
	onPlayerSelect: function(id) {
		// when its player turn, we select the active hero item and the first action
		// then we make actions menu active
		this.heroesMenu.select(id);
		this.actionsMenu.select(0);
		this.currentMenu = this.actionsMenu;
	},
	// we have action selected and we make the enemies menu active
	// the player needs to choose an enemy to attack
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

// the message class extends containter
export const Message = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize: function Message(scene, events) {
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
			wordWrap: { width: 170, useAdvancedWrap: true },
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
