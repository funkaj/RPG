import Phaser from 'phaser';
import Unit from '../battle/unit';

const Enemy = new Phaser.Class({
	Extends: Unit,

	initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		this.setScale(1.5);
	},
});

export default Enemy;
