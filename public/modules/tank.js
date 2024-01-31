
import { Healthbar } from "./healthbar.js";

export class Tank extends Phaser.GameObjects.Image {
  constructor(scene, x, y, controller) {
    super(scene, x, y, "tank");
    this.setScale(0.25);
    scene.add.existing(this);

    this.controller = controller;

    this.uuid = Phaser.Math.RND.uuid();

    // const healthBarOffsetX = 50;
    // const healthBarOffsetY = -50;
    this.healthbar = new Healthbar(scene, x, y, 80, 6, 50);
    this.maxHitPoints = 5;
    this.hitPoints = 5;

    this.ammo = 5;

    scene.physics.add.existing(this);
    this.body.setSize(200, 200)
  }

  shootProjectile () {
    if (this.ammo <= 0) {
      return;
    }
    this.ammo--;

    let projectile = this.scene.add.ellipse(this.x, this.y, 10, 10, "0x00ff00").setData({ tankUuid: this.uuid });
    this.scene.projectilesGroup.add(projectile);

    let vec = new Phaser.Math.Vector2(0, -1000).rotate(this.rotation); // can probably do this with 4 vectors to reduce the amount of math

    projectile.body.setVelocity(vec.x, vec.y);
  }

  takeHit () {
    this.hitPoints--;
    if (this.hitPoints <= 0) {
      this.destroy();
    } else {
      this.updateHealthbar();
    }
  }

  replenishAmmo(ammoToReplenish) {
    this.ammo += ammoToReplenish;
  }

  replenishHealth(hitPointsToReplenish) {
    this.hitPoints = Math.max(this.maxHitPoints, this.hitPoints + hitPointsToReplenish);
    this.updateHealthbar();
  }

  updateHealthbar() {
    this.healthbar.setPercentage(this.hitPoints / this.maxHitPoints);
  }

  destroy() {
    super.destroy();
    this.healthbar.destroy();
  }

  update () {
    if (!this.active) {
      return;
    }

    this.body.setVelocity(0);
    if (this.controller.left.isDown) {
      this.setAngle(-90);
      this.body.setVelocityX(-160);
    } else if (this.controller.right.isDown) {
      this.setAngle(90);
      this.body.setVelocityX(160);
    } else if (this.controller.up.isDown) {
      this.setAngle(0);
      this.body.setVelocityY(-160);
    } else if (this.controller.down.isDown) {
      this.setAngle(180);
      this.body.setVelocityY(160);
    }

    if (this.controller.shootKeyPressed) {
      this.shootProjectile();
    }

    this.healthbar.updatePosition(this.x, this.y);
  }
}
