
export class Tank {
  constructor(scene, x, y, controller) {
    this.obj = scene.physics.add.image(x, y, "tank").setScale(0.3).setCollideWorldBounds(true);
    this.controller = controller;
  }

  update () {
    if (this.controller.left.isDown) {
      this.obj.setAngle(-90).setVelocityX(-160);
    } else if (this.controller.right.isDown) {
      this.obj.setAngle(90).setVelocityX(160);
    } else {
      this.obj.setVelocityX(0);
    }

    if (this.controller.up.isDown) {
      this.obj.setAngle(0).setVelocityY(-160);
    } else if (this.controller.down.isDown) {
      this.obj.setAngle(180).setVelocityY(160);
    } else {
      this.obj.setVelocityY(0);
    }
  }
}
