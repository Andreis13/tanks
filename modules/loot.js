
export class Loot extends Phaser.GameObjects.Image {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    this.type = type;

    scene.add.existing(this);

  }

  pickUp(tank) {
    if (this.type == "ammo") {
      tank.replenishAmmo(5);
    } else if (this.type == "medkit") {
      tank.replenishHealth(2);
    }

    this.destroy();
  }
}
