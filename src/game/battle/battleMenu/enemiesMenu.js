import Phaser from 'phaser';
import Menu from './menu';

export const EnemiesMenu = new Phaser.Class({
	Extends: Menu,

	initialize: function EnemiesMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
	},
	confirm: function() {
		// the player has selected the enemy and we send its id with the event
		this.scene.events.emit('Enemy', this.menuItemIndex);
	},
});

export default EnemiesMenu;
