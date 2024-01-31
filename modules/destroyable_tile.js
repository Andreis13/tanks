
import { Healthbar } from "./healthbar.js";

export class DestroyableTile extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, timeToDestroy, hitPoints) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    // scene.physics.add.existing(this);

    this.healthPerHitPoint = 1.01 / hitPoints;

    this.health = 1.0;
    this.healthbar = new Healthbar(scene, x, y + 15, 40, 5); // 25 -> half grid size
    this.healthbar.hide();
    this.timeToDestroy = timeToDestroy; // ms
  }

  handleProjectileHit() {
    this.health -= this.healthPerHitPoint;
    this.healthbar.setPercentage(this.health);

    if (this.health < 1.0) {
      this.healthbar.reveal();
    }

    if (this.health <= 0) {
      this.destroy();
    }
  }

  handleTankContact(timeDelta) {
    this.health -= timeDelta / (this.timeToDestroy / 2); // reson for /2 is that every other frame there's no collision (I think because objects are separated)
    this.healthbar.setPercentage(this.health);

    if (this.health < 1.0) {
      this.healthbar.reveal();
    }

    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.healthbar.destroy();
    super.destroy();
  }
}
