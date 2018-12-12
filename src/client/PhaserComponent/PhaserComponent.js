import React from 'react';
import Phaser from 'phaser';


let gameOptions = {
	tileSize: 40,
	gameWidth: 320,
	gameHeight: 420,
	gameSpeed: 100
}
class PhaserComponent extends React.Component {
	
	
	render() {
		return (
			window.onload = function () {

				let config = {
					type: Phaser.CANVAS,
					width: gameOptions.gameWidth,
					height: gameOptions.gameHeight,
					physics: {
						default: 'arcade',
						arcade: {
							gravity: {
								y: 200
							}
						}
					},
					scene: {
						preload: preload,
						create: create,
					}
				};

				let game = new Phaser.Game(config);

				resize();
				window.addEventListener("resize", resize, false);

				function preload() {
					this.load.setBaseURL('http://labs.phaser.io');
					this.load.image('sky', 'assets/skies/space3.png');
					this.load.image('logo', 'assets/sprites/phaser3-logo.png');
					this.load.image('red', 'assets/particles/red.png');
				}

				function create() {
					//background
					this.add.image(0, 0, 'sky').setOrigin(0, 0);

					// phaser logo and particle emitter
					let particles = this.add.particles('red');

					let emitter = particles.createEmitter({
						speed: 100,
						scale: {
							start: 1,
							end: 0
						},
						blendMode: 'ADD'
					});
					let logo = this.physics.add.image(150, 150, 'logo').setScale(0.4);

					logo.setVelocity(100, 200);
					logo.setBounce(1, 1);
					logo.setCollideWorldBounds(true);

					emitter.startFollow(logo);
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
}

export default PhaserComponent;