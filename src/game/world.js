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
					//works
					//this.load.image('tiles', 'assets/map/spritesheet.png');
					//test
					this.load.image('tiles', './assets/images/sheet.png');

					// map in json format
					//works
					//this.load.tilemapTiledJSON('map', 'assets/map/map.json');
					//test
					this.load.tilemapTiledJSON('map', './assets/maps/landscape.json');

					// enemies
					this.load.image('cultist', 'assets/images/disciple.png');
					this.load.image('flame', 'assets/images/flameball.png');

					// our two characters
					//works
					//this.load.spritesheet('player', 'assets/RPG_assets.png', {
					//	frameWidth: 16,
					//	frameHeight: 16,
					//});
					//test
					this.load.atlas(
						'player',
						'./assets/images/atlas/lid.png',
						'./assets/images/atlas/lid.json',
						{
							frameWidth: 16,
							frameHeight: 16,
						}
					);
					this.load.image('beryl', './assets/images/beryl_standby_01.png');
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
					//var grass = map.createStaticLayer('Grass', tiles, 0, 0);
					//var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
					//test
					var bottomLayer = map.createStaticLayer('bottomLayer', tiles, 0, 0);
					var midLayer = map.createStaticLayer('midLayer', tiles, 0, 0);

					// make all tiles in obstacles collidable
					//obstacles.setCollisionByExclusion([-1]);
					//test
					midLayer.setCollisionByExclusion([-1]);

					//  animation with key 'left', we don't need left and right as we will use one and flip the sprite
					//this.anims.create({
					//	key: 'left',
					//	frames: this.anims.generateFrameNumbers('player', {
					//		frames: [1, 7, 1, 13],
					//	}),
					//	frameRate: 10,
					//	repeat: -1,
					//});
					//
					//// animation with key 'right'
					//this.anims.create({
					//	key: 'right',
					//	frames: this.anims.generateFrameNumbers('player', {
					//		frames: [1, 7, 1, 13],
					//	}),
					//	frameRate: 10,
					//	repeat: -1,
					//});
					//this.anims.create({
					//	key: 'up',
					//	frames: this.anims.generateFrameNumbers('player', {
					//		frames: [2, 8, 2, 14],
					//	}),
					//	frameRate: 10,
					//	repeat: -1,
					//});
					//this.anims.create({
					//	key: 'down',
					//	frames: this.anims.generateFrameNumbers('player', {
					//		frames: [0, 6, 0, 12],
					//	}),
					//	frameRate: 10,
					//	repeat: -1,
					//});
					const anims = this.anims;

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
					//our player sprite created through the phycis system
					//this.player = this.physics.add.sprite(50, 100, 'player', 6);
					const spawnPoint = map.findObject(
						'gameObject',
						obj => obj.name === 'start'
					);
					this.player = this.physics.add
						.sprite(spawnPoint.x, spawnPoint.y, 'player', 'idle/front/0001.png')
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
