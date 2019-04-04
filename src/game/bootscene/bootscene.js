import Phaser from 'phaser';

const BootScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function BootScene() {
		Phaser.Scene.call(this, { key: 'BootScene' });
	},

	preload: function() {
		// map tiles
		this.load.image('tiles', './assets/images/sheet.png');

		// map in json format
		this.load.tilemapTiledJSON('map', './assets/maps/landscape.json');

		// enemies
		this.load.atlas(
			'cultist',
			'assets/images/cultist.png',
			'assets/images/cultist.json'
		);
		this.load.atlas(
			'flame',
			'assets/images/flame.png',
			'assets/images/flame.json'
		);

		// our two characters
		this.load.atlas(
			'player',
			'./assets/images/atlas/lid.png',
			'./assets/images/atlas/lid.json',
			{
				frameWidth: 16,
				frameHeight: 16,
			}
		);
		this.load.atlas(
			'beryl',
			'./assets/images/atlas/beryl.png',
			'./assets/images/atlas/beryl.json',
			{
				frameWidth: 16,
				frameHeight: 16,
			}
		);
	},

	create: function() {
		// start the WorldScene
		this.scene.start('WorldScene');
	},
});

export default BootScene;
