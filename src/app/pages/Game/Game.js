import React from "react";
import Phaser from 'phaser';

class Game extends React.Component {

    render() {

        return (
            
            window.onload = function () {
				 
				
                // var BootScene = new Phaser.Class({
 
				// 	Extends: Phaser.Scene,
				 
				// 	initialize:
				 
				// 	function BootScene ()
				// 	{
				// 		Phaser.Scene.call(this, { key: 'BootScene' });
				// 	},
				 
				// 	preload: function ()
				// 	{
                //     	this.load.image('sheet', './assets/images/sheet.png');
				// 		this.load.tilemapTiledJSON('lvl', './assets/maps/landscape.json');
        		// 		this.load.atlas("lid", "./assets/images/atlas/lid.png", "./assets/images/atlas/lid.json", {
				// 			frameWidth: 16,
				// 			frameHeight: 16
				// 		});
				// 	},
				 
				// 	create: function ()
				// 	{
				// 		this.scene.start('WorldScene');
				// 	}
				// });
				 
				// var WorldScene = new Phaser.Class({
				 
				// 	Extends: Phaser.Scene,
				 
				// 	initialize:
				 
				// 	function WorldScene ()
				// 	{
				// 		Phaser.Scene.call(this, { key: 'WorldScene' });
				// 	},
				// 	preload: function ()
				// 	{
						
				// 	},
				// 	create: function ()
				// 	{
				// 		const map = this.make.tilemap({
				// 			key: "lvl"
				// 		});
				// 		let tiled = map.addTilesetImage('sheet', 'sheet');
                //     	 let bottomLayer = map.createStaticLayer('bottomLayer', tiled, 0, 0);
                //     	let midLayer = map.createStaticLayer('midLayer', tiled, 0, 0);
				// 		 let topLayer = map.createStaticLayer('topLayer', tiled, 0, 0);
						
						

				// 		const spawnPoint = map.findObject("gameObject", obj => obj.name === "start");
                //     player = this.physics.add
                //         .sprite(spawnPoint.x, spawnPoint.y, "lid", "idle/front/0001.png")
                //         .setSize(30, 40)
                //         .setOffset(20, 24);
        
        
                //     cursors = this.input.keyboard.createCursorKeys();
					
				// 	midLayer.setCollisionByProperty({
				// 		collides: true
				// 	});
				// 	this.physics.add.collider(player, midLayer);
                //     const anims = this.anims;
        
        
                //     anims.create({
                //         key: "left",
                //         frames: this.anims.generateFrameNames('lid', {
                //             start: 0,
                //             end: 10,
                //             zeroPad: 4,
                //             prefix: 'run/left/',
                //             suffix: '.png'
                //         }),
                //         frameRate: 10,
                //         repeat: -1
                //     });
                //     anims.create({
                //         key: "right",
                //         frames: anims.generateFrameNames("lid", {
                //             prefix: "run/right/",
                //             suffix: '.png',
                //             start: 0,
                //             end: 10,
                //             zeroPad: 4,
                //         }),
                //         frameRate: 10,
                //         repeat: -1
                //     });
                //     anims.create({
                //         key: "front",
                //         frames: anims.generateFrameNames("lid", {
                //             prefix: "run/front/",
                //             suffix: '.png',
                //             start: 0,
                //             end: 10,
                //             zeroPad: 4,
                //         }),
                //         frameRate: 10,
                //         repeat: -1
                //     });
                //     anims.create({
                //         key: "back",
                //         frames: anims.generateFrameNames("lid", {
                //             prefix: "run/back/",
                //             suffix: '.png',
                //             start: 0,
                //             end: 10,
                //             zeroPad: 4,
                //         }),
                //         frameRate: 10,
                //         repeat: -1
				// 	});
				// 	const camera = this.cameras.main;
        
                //     // Set up the arrows to control the camera
        
                //     camera.startFollow(player);
                //     camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
				// 	cursors = this.input.keyboard.createCursorKeys();
				// 	const speed = 175;
                //     const prevVelocity = player.body.velocity.clone();
                //     // Stop any previous movement from the last frame
                //     player.body.setVelocity(0);
        
                //     // Horizontal movement
                //     if (cursors.left.isDown) {
                //         player.body.setVelocityX(-100);
                //     } else if (cursors.right.isDown) {
                //         player.body.setVelocityX(100);
                //     }
        
                //     // Vertical movement
                //     if (cursors.up.isDown) {
                //         player.body.setVelocityY(-100);
                //     } else if (cursors.down.isDown) {
                //         player.body.setVelocityY(100);
                //     }
                //     player.body.velocity.normalize().scale(speed);
        
                //     // Update the animation last and give left/right animations precedence over up/down animations
                //     if (cursors.left.isDown) {
                //         player.anims.play("left", true);
                //     } else if (cursors.right.isDown) {
                //         player.anims.play("right", true);
                //     } else if (cursors.up.isDown) {
                //         player.anims.play("back", true);
                //     } else if (cursors.down.isDown) {
                //         player.anims.play("front", true);
                //     } else {
                //         player.anims.stop();
        
                //         // If we were moving, pick and idle frame to use
                //         if (prevVelocity.x < 0) player.setTexture("lid", "idle/left/0001.png");
                //         else if (prevVelocity.x > 0) player.setTexture("lid", "idle/right/0001.png");
                //         else if (prevVelocity.y < 0) player.setTexture("lid", "idle/back/0001.png");
                //         else if (prevVelocity.y > 0) player.setTexture("lid", "idle/front/0001.png");
				// 	}
				// }
				// });
				 
                let config = {
                    type: Phaser.AUTO,
                    width: 800,
                    height: 600,
                    pixelArt: true,
                    physics: {
                        default: 'arcade',
                        arcade: {
                            gravity: {
                                y: 0
							},
							debug: true
                        }
                    },
                    scene: {
						preload,
						create,
						update
                    }
                };
        
                const game = new Phaser.Game(config);
				// let controls;
                let player;
				let cursors;
        
                resize();
                window.addEventListener("resize", resize, false);
        
                function preload() {
                    this.load.tilemapTiledJSON('lvl', './assets/maps/landscape.json');
                    this.load.image('sheet', './assets/images/sheet.png');
                    this.load.atlas("lid", "./assets/images/atlas/lid.png", "./assets/images/atlas/lid.json");
                }
        
               function create() {
                    const map = this.make.tilemap({
                        key: "lvl"
                    });
        
                    let tiled = map.addTilesetImage('sheet', 'sheet');
                    let bottomLayer = map.createStaticLayer('bottomLayer', tiled, 0, 0);
                    let midLayer = map.createStaticLayer('midLayer', tiled, 0, 0);
                    // let topLayer = map.createStaticLayer('topLayer', tiled, 0, 0);
        
                    const spawnPoint = map.findObject("gameObject", obj => obj.name === "start");
                    player = this.physics.add
                        .sprite(spawnPoint.x, spawnPoint.y, "lid", "idle/front/0001.png")
                        .setSize(30, 40)
                        .setOffset(20, 24);
        
        
                    cursors = this.input.keyboard.createCursorKeys();
        
                    midLayer.setCollisionByProperty({
                        collides: true
                    });
        
                    this.physics.add.collider(player, midLayer);
                    const anims = this.anims;
        
        
                    anims.create({
                        key: "left",
                        frames: this.anims.generateFrameNames('lid', {
                            start: 0,
                            end: 10,
                            zeroPad: 4,
                            prefix: 'run/left/',
                            suffix: '.png'
                        }),
                        frameRate: 10,
                        repeat: -1
                    });
                    anims.create({
                        key: "right",
                        frames: anims.generateFrameNames("lid", {
                            prefix: "run/right/",
                            suffix: '.png',
                            start: 0,
                            end: 10,
                            zeroPad: 4,
                        }),
                        frameRate: 10,
                        repeat: -1
                    });
                    anims.create({
                        key: "front",
                        frames: anims.generateFrameNames("lid", {
                            prefix: "run/front/",
                            suffix: '.png',
                            start: 0,
                            end: 10,
                            zeroPad: 4,
                        }),
                        frameRate: 10,
                        repeat: -1
                    });
                    anims.create({
                        key: "back",
                        frames: anims.generateFrameNames("lid", {
                            prefix: "run/back/",
                            suffix: '.png',
                            start: 0,
                            end: 10,
                            zeroPad: 4,
                        }),
                        frameRate: 10,
                        repeat: -1
					});
					
					// this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
					// for(var i = 0; i < 30; i++) {
					// 	var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
					// 	var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
					// 	// parameters are x, y, width, height
					// 	this.spawns.create(x, y, 20, 20);            
					// }        
					// this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
        
                    const camera = this.cameras.main;
        
                    // Set up the arrows to control the camera
        
                    camera.startFollow(player);
                    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
					cursors = this.input.keyboard.createCursorKeys();
					
        
               }
        
                function update(time, delta) {
                    const speed = 175;
                    const prevVelocity = player.body.velocity.clone();
                    // Stop any previous movement from the last frame
                    player.body.setVelocity(0);
        
                    // Horizontal movement
                    if (cursors.left.isDown) {
                        player.body.setVelocityX(-100);
                    } else if (cursors.right.isDown) {
                        player.body.setVelocityX(100);
                    }
        
                    // Vertical movement
                    if (cursors.up.isDown) {
                        player.body.setVelocityY(-100);
                    } else if (cursors.down.isDown) {
                        player.body.setVelocityY(100);
                    }
                    player.body.velocity.normalize().scale(speed);
        
                    // Update the animation last and give left/right animations precedence over up/down animations
                    if (cursors.left.isDown) {
                        player.anims.play("left", true);
                    } else if (cursors.right.isDown) {
                        player.anims.play("right", true);
                    } else if (cursors.up.isDown) {
                        player.anims.play("back", true);
                    } else if (cursors.down.isDown) {
                        player.anims.play("front", true);
                    } else {
                        player.anims.stop();
        
                        // If we were moving, pick and idle frame to use
                        if (prevVelocity.x < 0) player.setTexture("lid", "idle/left/0001.png");
                        else if (prevVelocity.x > 0) player.setTexture("lid", "idle/right/0001.png");
                        else if (prevVelocity.y < 0) player.setTexture("lid", "idle/back/0001.png");
                        else if (prevVelocity.y > 0) player.setTexture("lid", "idle/front/0001.png");
					}
					
               }
        
        
                // function to resize game screen to be responsive to screen size
                function resize() {
                    let canvas = document.querySelector('canvas');
                    let windowWidth = window.innerWidth;
                    let windowHeight = window.innerHeight;
                    let windowRatio = windowWidth / windowHeight;
                    let gameRatio = game.config.width / game.config.height;
                    if (windowRatio < gameRatio) {
                        canvas.style.width = windowWidth + "px";
                        canvas.style.height = (windowWidth / gameRatio) + "px";
                    } else {
                        canvas.style.width = (windowHeight * gameRatio) + "px";
                        canvas.style.height = windowHeight + "px";
                    }
                }
            }
        )
    }
};

export default Game;