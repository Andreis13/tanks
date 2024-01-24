
import { Tank } from "./tank.js";
import { LocalController } from "./local_controller.js"


export class Tanks extends Phaser.Scene {
  constructor (controllers) {
    super();

    this.controllers = controllers;
  }

  preload () {
    this.load.image("tank", "assets/panthera.png");
    this.load.image("crate", "assets/crate.png");
    this.load.image("brick", "assets/brick.png");
    this.load.image("metal", "assets/metal.png");
  }

  create () {
    this.controllers.push(new LocalController(this));

    const tankSpawnPositions = [];

    let tankPositions = [
      { x: 100, y: 500},
      { x: 300, y: 500},
      { x: 500, y: 500}
    ];

    this.tanks = [];

    this.tanksGroup = this.physics.add.group({ collideWorldBounds: true });

    for (let i = 0; i < this.controllers.length; i++) {
      let tank = new Tank(this, tankPositions[i].x, tankPositions[i].y, this.controllers[i]);
      this.tanks.push(tank);
      this.tanksGroup.add(tank.obj);
    }

    this.bricksGroup = this.physics.add.staticGroup();
    this.metalGroup = this.physics.add.staticGroup();
    this.cratesGroup = this.physics.add.staticGroup();

    this.bricksGroup.add(this.addGridTile(0, 0, "brick"));
    this.bricksGroup.add(this.addGridTile(1, 0, "brick"));
    this.bricksGroup.add(this.addGridTile(0, 1, "brick"));
    this.bricksGroup.add(this.addGridTile(1, 1, "brick"));

    this.metalGroup.add(this.addGridTile(5, 5, "metal"));
    this.metalGroup.add(this.addGridTile(5, 6, "metal"));

    this.cratesGroup.add(this.addGridTile(2, 6, "crate"));

    this.projectilesGroup = this.physics.add.group();
  }

  addGridTile (gridX, gridY, textureName) {
    const gridTileSize = 50;

    return this.add.image(gridX * gridTileSize, gridY * gridTileSize, textureName)
      .setDisplaySize(gridTileSize, gridTileSize)
      .setOrigin(0, 0);
  }

  update (time, delta) {
    this.tanks.forEach((tank) => tank.update(this.projectilesGroup));

    for (const projectile of this.projectilesGroup.children.entries) {
      if (!this.physics.world.bounds.contains(projectile.x, projectile.y)) {
        projectile.destroy();
      }
    }

    this.physics.overlap(this.tanksGroup, this.projectilesGroup, (tankObj, projectile) => {
      const projectileTank = projectile.data.get("tankRef");
      const collisionTank = tankObj.data.get("tankRef");

      if (projectileTank.uuid == collisionTank.uuid) {
        return;
      }

      collisionTank.takeHit();
      projectile.destroy();
    });

    this.physics.collide(this.tanksGroup, this.bricksGroup, (tank, brick) => {
      // destroy brick over 2-3 seconds and animate destruction
    });

    this.physics.collide(this.tanksGroup, this.metalGroup);
    this.physics.collide(this.tanksGroup, this.cratesGroup, (tank, crate) => {
      // destroy crate over one second and animate destruction, then replace with ammo or powerup
      crate.destroy();
    });

    this.physics.overlap(this.projectilesGroup, this.bricksGroup, (projectile, brick) => {
      // maybe require multiple shots to destroy bricks
      brick.destroy();
      projectile.destroy();
    });

    this.physics.overlap(this.projectilesGroup, this.metalGroup, (projectile, metal) => {
      projectile.destroy();
    });

    this.physics.overlap(this.projectilesGroup, this.cratesGroup, (projectile, crate) => {
      crate.destroy(); // shooting crates destroys the contents, i.e. no ammo or powerup
      projectile.destroy();
      // add explosion animation
    });

  }
}
