 import React from 'react';
 import Phaser from 'phaser';

 // // class gameObject {
 // // 	height: number;
 // // 	name: string;
 // // 	properties: any;
 // // 	rectange: boolean;
 // // 	rotation: number;
 // // 	type: string;
 // // 	visible: boolean;
 // // 	width: number;
 // // 	x: number;
 // // 	y: number;
 // // }
 // let gameOptions = {

 // 	gameWidth: 300,
 // 	gameHeight: 400,
 // 	gameSpeed: 100
 // }
 class PhaserComponent extends React.Component {

 	render() {
 		// HTML  CSS  Babel Result
 		// EDIT ON
 		/**
 		 * Author: Michael Hadley, mikewesthad.com
 		 * Asset Credits:
 		 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 		 */
		 return (
			window.onload = function () {
 		const config = {
 			type: Phaser.AUTO,
 			width: 800,
 			height: 600,
 			parent: "game-container",
 			pixelArt: true,
 			scene: {
 				preload: preload,
 				create: create,
 				update: update
 			}
 		};

 		const game = new Phaser.Game(config);
 		let controls;

 		function preload() {
 			this.load.image("tiles", "../../../public/assets/images/sheet.png");
 			this.load.tilemapTiledJSON("landscape", "../../../public/assets/maps/landscap.json");
 		}

 		function create() {
 			const map = this.make.tilemap({
 				key: "landscape"
 			});

 			// Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
 			// Phaser's cache (i.e. the name you used in preload)
 			const tileset = map.addTilesetImage("sheet", "tiles");

 			// Parameters: layer name (or index) from Tiled, tileset, x, y
 			const bottomLayer = map.createStaticLayer("bottomLayer", tileset, 0, 0);
 			const midLayer = map.createStaticLayer("midLayer", tileset, 0, 0);


 			// Phaser supports multiple cameras, but you can access the default camera like this:
 			const camera = this.cameras.main;

 			// Set up the arrows to control the camera
 			const cursors = this.input.keyboard.createCursorKeys();
 			controls = new Phaser.Cameras.Controls.FixedKeyControl({
 				camera: camera,
 				left: cursors.left,
 				right: cursors.right,
 				up: cursors.up,
 				down: cursors.down,
 				speed: 0.5
 			});

 			// Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
 			camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

 			// Help text that has a "fixed" position on the screen
 			this.add
 				.text(16, 16, "Arrow keys to scroll", {
 					font: "18px monospace",
 					fill: "#ffffff",
 					padding: {
 						x: 20,
 						y: 10
 					},
 					backgroundColor: "#000000"
 				})
 				.setScrollFactor(0);
 		}

 		function update(time, delta) {
 			// Apply the controls to the camera each update tick of the game
 			controls.update(delta);
 		}
 		// 		
 		// 			

 		// 				let config = {
 		// 					type: Phaser.CANVAS,
 		// 					width: gameOptions.gameWidth,
 		// 					height: gameOptions.gameHeight,
 		// 					physics: {
 		// 						default: 'arcade',
 		// 						arcade: {
 		// 							gravity: {
 		// 								y: 200
 		// 							}
 		// 						}
 		// 					},
 		// 					scene: {
 		// 						preload: preload,
 		// 						create: create,
 		// 					}
 		// 				};

 		// 				let game = new Phaser.Game(config);

 		// 				resize();
 		// 				window.addEventListener("resize", resize, false);

 		// 				function preload() {
 		// 					//this.load.setBaseURL('http://labs.phaser.io');
 		// 					this.load.image('tiles', '../../public/assets/images/sheet.png');
 		// 					this.load.tilemapTiledJSON('landscape',   '../../public/assets/maps/landscape.json');
 		// 					this.load.image('logo', 'assets/sprites/phaser3-logo.png');
 		// 					this.load.image('red', 'assets/particles/red.png');
 		// 				}

 		// 				function create() {
 		// 					const map = this.make.tilemap({ key: 'landscape' });
 		// 					//background
 		// 					const tileset = map.addTilesImage('sheet', 'tiles');

 		// 					const belowLayer = map.createStaticLayer('bottomLayer', tileset, 0, 0);
 		// 					const midLayer = map.createStaticLayer('midLayer', tileset, 0, 0);

 		// 					// phaser logo and particle emitter
 		// 					let particles = this.add.particles('red');

 		// 					let emitter = particles.createEmitter({
 		// 						speed: 100,
 		// 						scale: {
 		// 							start: 1,
 		// 							end: 0
 		// 						},
 		// 						blendMode: 'ADD'
 		// 					});
 		// 					let logo = this.physics.add.image(150, 150, 'logo').setScale(0.4);

 		// 					logo.setVelocity(100, 200);
 		// 					logo.setBounce(1, 1);
 		// 					logo.setCollideWorldBounds(true);

 		// 					emitter.startFollow(logo);
 		// 				}
 		// 				// function to resize game screen to be responsive to screen size
 		// 				function resize() {
 		// 					let canvas = document.querySelector('canvas');
 		// 					let windowWidth = window.innerWidth;
 		// 					let windowHeight = window.innerHeight;
 		// 					let windowRatio = windowWidth / windowHeight;
 		// 					let gameRatio = game.config.width / game.config.height;
 		// 					if (windowRatio < gameRatio) {
 		// 						canvas.style.width = windowWidth + "px";
 		// 						canvas.style.height = (windowWidth / gameRatio) + "px";
 		// 					} else {
 		// 						canvas.style.width = (windowHeight * gameRatio) + "px";
 		// 						canvas.style.height = windowHeight + "px";
 		// 					}
 		// 				}

 					}
 				)
 	}
 }
  //exports PhaserComponent to App.js
 export default PhaserComponent;