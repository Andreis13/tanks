class Tanks extends Phaser.Scene {
  preload () {
    this.load.image("tank", "assets/panthera.png")
  }

  create () {
    this.tank = this.physics.add.image(100, 450, "tank")
      .setScale(0.3)
      .setCollideWorldBounds(true)
    this.controls = this.input.keyboard.createCursorKeys();
  }

  update (time, delta) {
    if (this.controls.left.isDown) {
      this.tank.setAngle(-90).setVelocityX(-160);
    } else if (this.controls.right.isDown) {
      this.tank.setAngle(90).setVelocityX(160);
    } else {
      this.tank.setVelocityX(0);
    }

    if (this.controls.up.isDown) {
      this.tank.setAngle(0).setVelocityY(-160);
    } else if (this.controls.down.isDown) {
      this.tank.setAngle(180).setVelocityY(160);
    } else {
      this.tank.setVelocityY(0);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Tanks,
  parent: "game-viewport",
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
};


window.onload = (event) => {
  const game = new Phaser.Game(config);
};
