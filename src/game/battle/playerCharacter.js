import Phaser from 'phaser';
import Unit from '../battle/unit';

const PlayerCharacter = new Phaser.Class({
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

		this.setScale(0.8);
	},
});

export default PlayerCharacter;
