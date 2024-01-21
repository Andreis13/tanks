
import { Tank } from "./tank.js";

export class Tanks extends Phaser.Scene {
  constructor (remoteControllers) {
    super();

    this.remoteControllers = remoteControllers;
  }

  preload () {
    this.load.image("tank", "assets/panthera.png")
  }

  create () {
    let tankPositions = [
      { x: 100, y: 100},
      { x: 100, y: 200},
      { x: 100, y: 300}
    ];

    this.tanks = [];

    for (let i = 0; i < this.remoteControllers.length; i++) {
      this.tanks.push(new Tank(this, tankPositions[i].x, tankPositions[i].y, this.remoteControllers[i]))
    }

    // this.controls = this.input.keyboard.createCursorKeys();
  }

  update (time, delta) {
    this.tanks.forEach((tank) => tank.update());
  }
}
