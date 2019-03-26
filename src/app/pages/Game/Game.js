import React from 'react';
import Phaser from 'phaser';

class Game extends React.Component {
	render() {
		return (window.onload = function() {
			let BootScene = new Phaser.Class({
				Extends: Phaser.Scene,

				initialize: function BootScene() {
					Phaser.Scene.call(this, { key: 'BootScene' });
					resize();
					window.addEventListener('resize', resize, false);
				},

				preload: function() {
					this.load.tilemapTiledJSON('lvl', './assets/maps/landscape.json');
					this.load.image('sheet', './assets/images/sheet.png');
					this.load.atlas(
						'lid',
						'./assets/images/atlas/lid.png',
						'./assets/images/atlas/lid.json'
					);
				},

				create: function() {
					this.scene.start('WorldScene');
				},
			});

			let WorldScene = new Phaser.Class({
				//What does this do?
				Extends: Phaser.Scene,

				initialize: function WorldScene() {
					Phaser.Scene.call(this, { key: 'WorldScene' });
				},

				preload: function() {},

				create: function() {
					// create the map
					const map = this.make.tilemap({
						key: 'lvl',
					});

					// first parameter is the name of the tilemap in tiled
					let tiled = map.addTilesetImage('sheet', 'sheet');

					// creating the layers
					let bottomLayer = map.createStaticLayer('bottomLayer', tiled, 0, 0);
					let midLayer = map.createStaticLayer('midLayer', tiled, 0, 0);
					// let topLayer = map.createStaticLayer('topLayer', tiled, 0, 0);

					midLayer.setCollisionByExclusion([-1]);
					// user input
					this.cursors = this.input.keyboard.createCursorKeys();
					//animation keys
					this.anims.create({
						key: 'left',
						frames: this.anims.generateFrameNames('lid', {
							start: 0,
							end: 10,
							zeroPad: 4,
							prefix: 'run/left/',
							suffix: '.png',
						}),
						frameRate: 10,
						repeat: -1,
					});
					this.anims.create({
						key: 'right',
						frames: this.anims.generateFrameNames('lid', {
							prefix: 'run/right/',
							suffix: '.png',
							start: 0,
							end: 10,
							zeroPad: 4,
						}),
						frameRate: 10,
						repeat: -1,
					});
					this.anims.create({
						key: 'front',
						frames: this.anims.generateFrameNames('lid', {
							prefix: 'run/front/',
							suffix: '.png',
							start: 0,
							end: 10,
							zeroPad: 4,
						}),
						frameRate: 10,
						repeat: -1,
					});
					this.anims.create({
						key: 'back',
						frames: this.anims.generateFrameNames('lid', {
							prefix: 'run/back/',
							suffix: '.png',
							start: 0,
							end: 10,
							zeroPad: 4,
						}),
						frameRate: 10,
						repeat: -1,
					});

					//create sprite
					this.player = this.physics.add
						.sprite(500, 430, 'lid', 'idle/front/0001.png')
						.setSize(30, 40)
						.setOffset(20, 24);

					// don't go out of the map
					this.physics.world.bounds.width = map.widthInPixels;
					this.physics.world.bounds.height = map.heightInPixels;
					this.player.setCollideWorldBounds(true);
					this.physics.add.collider(this.player, midLayer);
					//limit camera movement to character
					this.cameras.main.startFollow(this.player);
					this.cameras.main.setBounds(
						0,
						0,
						map.widthInPixels,
						map.heightInPixels
					);
					this.cameras.main.roundPixels = true; // avoid tile bleed

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
					this.physics.add.overlap(
						this.player,
						this.spawns,
						this.onMeetEnemy,
						false,
						this
					);
				},
				onMeetEnemy: function(player, zone) {
					// we move the zone to some other location
					zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
					zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

					// shake the world
					this.cameras.main.shake(300);

					// start battle
				},
				update: function(time, delta) {
					const speed = 175;
					const prevVelocity = this.player.body.velocity.clone();

					this.player.body.setVelocity(0);

					// Horizontal movement
					if (this.cursors.left.isDown) {
						this.player.body.setVelocityX(-100);
					} else if (this.cursors.right.isDown) {
						this.player.body.setVelocityX(100);
					}

					// Vertical movement
					if (this.cursors.up.isDown) {
						this.player.body.setVelocityY(-100);
					} else if (this.cursors.down.isDown) {
						this.player.body.setVelocityY(100);
					}
					this.player.body.velocity.normalize().scale(speed);

					// Update the animation last and give left/right animations precedence over up/down animations
					if (this.cursors.left.isDown) {
						this.player.anims.play('left', true);
					} else if (this.cursors.right.isDown) {
						this.player.anims.play('right', true);
					} else if (this.cursors.up.isDown) {
						this.player.anims.play('back', true);
					} else if (this.cursors.down.isDown) {
						this.player.anims.play('front', true);
					} else {
						this.player.anims.stop();

						// If we were moving, pick and idle frame to use
						if (prevVelocity.x < 0)
							this.player.setTexture('lid', 'idle/left/0001.png');
						else if (prevVelocity.x > 0)
							this.player.setTexture('lid', 'idle/right/0001.png');
						else if (prevVelocity.y < 0)
							this.player.setTexture('lid', 'idle/back/0001.png');
						else if (prevVelocity.y > 0)
							this.player.setTexture('lid', 'idle/front/0001.png');
					}
				},
			});

			// function to resize game screen to be responsive to screen size
			function resize() {
				let canvas = document.querySelector('canvas');
				let windowWidth = window.innerWidth;
				let windowHeight = window.innerHeight;
				let windowRatio = windowWidth / windowHeight;
				let gameRatio = game.config.width / game.config.height;
				if (windowRatio < gameRatio) {
					canvas.style.width = windowWidth + 'px';
					canvas.style.height = windowWidth / gameRatio + 'px';
				} else {
					canvas.style.width = windowHeight * gameRatio + 'px';
					canvas.style.height = windowHeight + 'px';
				}
			}

			let config = {
				type: Phaser.AUTO,
				width: 800,
				height: 600,
				pixelArt: true,
				physics: {
					default: 'arcade',
					arcade: {
						gravity: {
							y: 0,
						},
						debug: true,
					},
				},
				scene: [BootScene, WorldScene],
			};
			var game = new Phaser.Game(config);
		});
	}
}

export default Game;
