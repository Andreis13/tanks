
import { Healthbar } from "./healthbar.js";

export class Tank {
  constructor(scene, x, y, controller) {
    super(scene, x, y);
    this.scene = scene;
    this.obj = scene.physics.add.image(x, y, "tank").setScale(0.3).setCollideWorldBounds(true);
    this.controller = controller;

    this.uuid = Phaser.Math.RND.uuid();
    this.obj.setData({ tankRef: this }); // pretty sure this could lead to obscure bugs

    const healthBarOffsetX = 50;
    const healthBarOffsetY = -50;
    this.healthbar = new Healthbar(scene, x, y, 100, 10, 50);
    this.maxHitPoints = 5;
    this.hitPoints = 5;
  }

  shootProjectile (projectilesGroup) {
    let projectile = this.scene.add.ellipse(this.obj.x, this.obj.y, 10, 10, "0xff0000").setData({ tankRef: this });;
    projectilesGroup.add(projectile);

    let vec = new Phaser.Math.Vector2(0, -1000).rotate(this.obj.rotation); // can probably do this with 4 vectors to reduce the amount of math

    projectile.body.setVelocity(vec.x, vec.y);
  }

  takeHit () {
    this.hitPoints--;
    if (this.hitPoints <= 0) {
      this.destroy();
    } else {
      this.healthbar.setPercentage(this.hitPoints / this.maxHitPoints);
    }
  }

  destroy() {
    this.obj.destroy();
    this.healthbar.destroy();
  }

  update (projectilesGroup) {
    if (!this.obj.active) {
      return;
    }

    this.obj.setVelocity(0);
    if (this.controller.left.isDown) {
      this.obj.setAngle(-90).setVelocityX(-160);
    } else if (this.controller.right.isDown) {
      this.obj.setAngle(90).setVelocityX(160);
    } else if (this.controller.up.isDown) {
      this.obj.setAngle(0).setVelocityY(-160);
    } else if (this.controller.down.isDown) {
      this.obj.setAngle(180).setVelocityY(160);
    }

    if (this.controller.shootKeyPressed) {
      this.shootProjectile(projectilesGroup);
    }

    this.healthbar.updatePosition(this.obj.x, this.obj.y);
  }
}
