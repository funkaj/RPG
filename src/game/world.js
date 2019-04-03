import React from 'react';
import Phaser from 'phaser';
import { BattleScene } from './battle';
import { UIScene } from './battle';
import './style.css';

class Game extends React.Component {
	render() {
		return (window.onload = function() {
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

			const WorldScene = new Phaser.Class({
				Extends: Phaser.Scene,

				initialize: function WorldScene() {
					Phaser.Scene.call(this, { key: 'WorldScene' });
				},

				preload: function() {},

				create: function() {
					// create the map
					var map = this.make.tilemap({ key: 'map' });

					// first parameter is the name of the tilemap in tiled
					var tiles = map.addTilesetImage('sheet', 'tiles');

					// creating the layers
					// eslint-disable-next-line no-unused-vars
					var bottomLayer = map.createStaticLayer('bottomLayer', tiles, 0, 0);
					var midLayer = map.createStaticLayer('midLayer', tiles, 0, 0);

					// make all tiles in obstacles collidable
					midLayer.setCollisionByExclusion([-1]);

					const anims = this.anims;
					anims.create({
						key: 'idle-lid-battle',
						frames: this.anims.generateFrameNames('player', {
							start: 0,
							end: 7,
							zeroPad: 4,
							prefix: 'idle/left/',
							suffix: '.png',
						}),
						frameRate: 10,
						repeat: -1,
					});
					anims.create({
						key: 'left',
						frames: this.anims.generateFrameNames('player', {
							start: 0,
							end: 10,
							zeroPad: 4,
							prefix: 'run/left/',
							suffix: '.png',
						}),
						frameRate: 10,
						repeat: -1,
					});
					anims.create({
						key: 'right',
						frames: anims.generateFrameNames('player', {
							prefix: 'run/right/',
							suffix: '.png',
							start: 0,
							end: 10,
							zeroPad: 4,
						}),
						frameRate: 10,
						repeat: -1,
					});
					anims.create({
						key: 'down',
						frames: anims.generateFrameNames('player', {
							prefix: 'run/front/',
							suffix: '.png',
							start: 0,
							end: 10,
							zeroPad: 4,
						}),
						frameRate: 10,
						repeat: -1,
					});
					anims.create({
						key: 'up',
						frames: anims.generateFrameNames('player', {
							prefix: 'run/back/',
							suffix: '.png',
							start: 0,
							end: 10,
							zeroPad: 4,
						}),
						frameRate: 10,
						repeat: -1,
					});
					//create beryl idle animation
					this.anims.create({
						key: 'idle',
						frames: this.anims.generateFrameNames('beryl', {
							start: 0,
							end: 4,
							zeroPad: 4,
							prefix: '401004807_idle_',
							suffix: '.png',
						}),
						frameRate: 4,
						repeat: -1,
					});
					//create cultist idle animation
					this.anims.create({
						key: 'idle-cultist',
						frames: this.anims.generateFrameNames('cultist', {
							start: 0,
							end: 13,
							zeroPad: 4,
							prefix: 'disciple-45x51_',
							suffix: '.png',
						}),
						frameRate: 4,
						repeat: -1,
					});
					//create flame idle animation
					this.anims.create({
						key: 'idle-flame',
						frames: this.anims.generateFrameNames('flame', {
							start: 0,
							end: 4,
							zeroPad: 4,
							prefix: 'flameball-32x32_',
							suffix: '.png',
						}),
						frameRate: 5,
						repeat: -1,
					});

					//our player sprite created through the phycis system
					const spawnPoint = map.findObject(
						'gameObject',
						obj => obj.name === 'start'
					);
					this.player = this.physics.add
						.sprite(spawnPoint.x, spawnPoint.y, 'player', 'idle/front/0001.png')
						.setScale(0.9)
						.setSize(30, 55)
						.setOffset(18, 5);

					// don't go out of the map
					this.physics.world.bounds.width = map.widthInPixels;
					this.physics.world.bounds.height = map.heightInPixels;
					this.player.setCollideWorldBounds(true);

					// don't walk on trees
					this.physics.add.collider(this.player, midLayer);

					// limit camera to map
					this.cameras.main.setBounds(
						0,
						0,
						map.widthInPixels,
						map.heightInPixels
					);
					this.cameras.main.startFollow(this.player);
					this.cameras.main.roundPixels = true; // avoid tile bleed

					// user input
					this.cursors = this.input.keyboard.createCursorKeys();

					// where the enemies will be
					this.spawns = this.physics.add.group({
						classType: Phaser.GameObjects.Zone,
					});
					for (var i = 0; i < 30; i++) {
						var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
						var y = Phaser.Math.RND.between(
							0,
							this.physics.world.bounds.height
						);
						// parameters are x, y, width, height
						this.spawns.create(x, y, 20, 20);
					}
					// add collider
					this.physics.add.overlap(
						this.player,
						this.spawns,
						this.onMeetEnemy,
						false,
						this
					);
					// we listen for 'wake' event
					this.sys.events.on('wake', this.wake, this);
				},
				wake: function() {
					this.cursors.left.reset();
					this.cursors.right.reset();
					this.cursors.up.reset();
					this.cursors.down.reset();
				},
				onMeetEnemy: function(player, zone) {
					// we move the zone to some other location
					zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
					zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

					// shake the world
					this.cameras.main.shake(300);

					this.input.stopPropagation();
					// start battle
					this.scene.switch('BattleScene');
				},
				update: function(time, delta) {
					// eslint-disable-next-line no-unused-vars
					const speed = 175;
					const prevVelocity = this.player.body.velocity.clone();
					this.player.body.setVelocity(0);

					// Horizontal movement
					if (this.cursors.left.isDown) {
						this.player.body.setVelocityX(-80);
					} else if (this.cursors.right.isDown) {
						this.player.body.setVelocityX(80);
					}
					// Vertical movement
					if (this.cursors.up.isDown) {
						this.player.body.setVelocityY(-80);
					} else if (this.cursors.down.isDown) {
						this.player.body.setVelocityY(80);
					}

					// Update the animation last and give left/right animations precedence over up/down animations
					if (this.cursors.left.isDown) {
						this.player.anims.play('left', true);
					} else if (this.cursors.right.isDown) {
						this.player.anims.play('right', true);
					} else if (this.cursors.up.isDown) {
						this.player.anims.play('up', true);
					} else if (this.cursors.down.isDown) {
						this.player.anims.play('down', true);
					} else {
						this.player.anims.stop();
						// If we were moving, pick and idle frame to use
						if (prevVelocity.x < 0)
							this.player.setTexture('player', 'idle/left/0001.png');
						else if (prevVelocity.x > 0)
							this.player.setTexture('player', 'idle/right/0001.png');
						else if (prevVelocity.y < 0)
							this.player.setTexture('player', 'idle/back/0001.png');
						else if (prevVelocity.y > 0)
							this.player.setTexture('player', 'idle/front/0001.png');
					}
				},
			});

			var config = {
				type: Phaser.AUTO,
				parent: 'content',
				width: 320,
				height: 240,
				zoom: 3,
				pixelArt: true,
				physics: {
					default: 'arcade',
					arcade: {
						gravity: { y: 0 },
						debug: true,
					},
				},
				scene: [BootScene, WorldScene, BattleScene, UIScene],
			};
			// eslint-disable-next-line no-unused-vars
			const game = new Phaser.Game(config);
		});
	}
}

// eslint-disable-next-line no-undef
export default Game;
