
import { Tank } from "./tank.js";
import { DestroyableTile } from "./destroyable_tile.js";
import { LocalController } from "./local_controller.js"
import { Loot } from "./loot.js"
import { Grid } from "./grid.js"
import { TileMap } from "./tile_map.js"


export class Tanks extends Phaser.Scene {
  constructor (controllers) {
    super();
    this.grid = new Grid(50);
    this.controllers = controllers;
  }

  preload () {
    this.load.image("tank", "assets/panthera.png");
    this.load.image("crate", "assets/crate.png");
    this.load.image("brick", "assets/brick.png");
    this.load.image("metal", "assets/metal.png");
    this.load.image("ammo", "assets/ammo.png");
    this.load.image("medkit", "assets/medkit.png");
  }

  create () {
    this.bricksGroup = this.physics.add.staticGroup();
    this.metalGroup = this.physics.add.staticGroup();
    this.cratesGroup = this.physics.add.staticGroup();
    this.lootGroup = this.physics.add.staticGroup();

    this.projectilesGroup = this.physics.add.group();

    for (const [x, y] of TileMap.brick) {
      this.addBrick(x, y);
    }

    for (const [x, y] of TileMap.metal) {
      this.addMetal(x, y);
    }

    for (const [x, y] of TileMap.crate) {
      this.addCrate(x, y);
    }

    for (const [x, y] of TileMap.medkit) {
      this.addMedkit(x, y);
    }

    for (const [x, y] of TileMap.ammo) {
      this.addAmmo(x, y);
    }

    this.tanks = [];
    this.tanksGroup = this.physics.add.group({ collideWorldBounds: true });

    this.controllers.push(new LocalController(this));
    for (let i = 0; i < this.controllers.length; i++) {
      let tank = new Tank(
        this,
        this.grid.tileCenterCoordX(TileMap.tank[i][0]),
        this.grid.tileCenterCoordY(TileMap.tank[i][1]),
        this.controllers[i]
      );

      this.tanks.push(tank);
      this.tanksGroup.add(tank);
    }
  }

  addBrick(x, y) {
    let brick = new DestroyableTile(this, this.grid.tileCenterCoordX(x), this.grid.tileCenterCoordY(y), "brick", 1000, 2)
      .setDisplaySize(this.grid.tileSize, this.grid.tileSize);

    this.bricksGroup.add(brick);
  }

  addCrate(x, y) {
    let crate = new DestroyableTile(this, this.grid.tileCenterCoordX(x), this.grid.tileCenterCoordY(y), "crate", 300, 1)
      .setDisplaySize(this.grid.tileSize, this.grid.tileSize);

    this.cratesGroup.add(crate);
  }

  addMetal(x, y) {
    let metal = this.add.image(this.grid.tileCenterCoordX(x), this.grid.tileCenterCoordY(y), "metal")
      .setDisplaySize(this.grid.tileSize, this.grid.tileSize);

    this.metalGroup.add(metal);
  }

  addMedkit(x, y) {
    let medkit = new Loot(this, this.grid.tileCenterCoordX(x), this.grid.tileCenterCoordY(y), "medkit")
      .setDisplaySize(this.grid.tileSize * 0.6, this.grid.tileSize * 0.6);

    this.lootGroup.add(medkit);
  }

  addAmmo(x, y) {
    let ammo = new Loot(this, this.grid.tileCenterCoordX(x), this.grid.tileCenterCoordY(y), "ammo")
      .setDisplaySize(this.grid.tileSize * 0.6, this.grid.tileSize * 0.6);

    this.lootGroup.add(ammo);
  }

  spawnLoot(x, y) {
    if (Phaser.Math.RND.frac() > 0.5) { // flip a coin
      this.addMedkit(x, y);
    } else {
      this.addAmmo(x, y);
    }
  }

  respawnLootAndCrates (time) {
    this.lastRespawnTime ||= time;
    const respawnInterval = 7000; // ms
    if (time - this.lastRespawnTime < respawnInterval) { return; }

    console.log("respawn");

    let possibleLocations = [];
    const lootLocations = [];
    lootLocations.push(...TileMap.ammo);
    lootLocations.push(...TileMap.medkit);

    console.log(lootLocations)
    for (const [x, y] of lootLocations) {
      let testPoint = new Phaser.Math.Vector2(this.grid.tileCenterCoordX(x), this.grid.tileCenterCoordY(y));
      let closestLoot = this.physics.closest(
        testPoint,
        this.lootGroup.children.entries
      )


      if (testPoint.distance(closestLoot) >= this.grid.tileSize) {
        possibleLocations.push(testPoint);
      }
    }

    if (possibleLocations.length > 0) {
      let spawnLocation = Phaser.Math.RND.pick(possibleLocations);
      this.spawnLoot(this.grid.tileNumberX(spawnLocation.x), this.grid.tileNumberY(spawnLocation.y));
    }

    this.lastRespawnTime = time;
  }

  update (time, delta) {
    this.tanks.forEach((tank) => tank.update());

    for (const projectile of this.projectilesGroup.children.entries) {
      if (!this.physics.world.bounds.contains(projectile.x, projectile.y)) {
        projectile.destroy();
      }
    }

    this.physics.overlap(this.tanksGroup, this.projectilesGroup, (tank, projectile) => {
      if (projectile.data.get("tankUuid") == tank.uuid) {
        return;
      }

      tank.takeHit();
      projectile.destroy();
    });

    this.physics.collide(this.tanksGroup, this.bricksGroup, (tank, brick) => {
      brick.handleTankContact(delta);
    });

    this.physics.collide(this.tanksGroup, this.metalGroup);

    this.physics.collide(this.tanksGroup, this.cratesGroup, (tank, crate) => {
      crate.handleTankContact(delta)
      if (crate.health <= 0) {
        console.log(crate.x, crate.y)
        this.spawnLoot(this.grid.tileNumberX(crate.x), this.grid.tileNumberY(crate.y));
      }
    });

    this.physics.overlap(this.projectilesGroup, this.bricksGroup, (projectile, brick) => {
      brick.handleProjectileHit();
      projectile.destroy();
    });

    this.physics.overlap(this.projectilesGroup, this.metalGroup, (projectile, metal) => {
      projectile.destroy();
    });

    this.physics.overlap(this.projectilesGroup, this.cratesGroup, (projectile, crate) => {
      crate.destroy();
      projectile.destroy();
      this.spawnLoot(this.grid.tileNumberX(crate.x), this.grid.tileNumberY(crate.y));
    });

    this.physics.overlap(this.lootGroup, this.tanksGroup, (loot, tank) => {
      loot.pickUp(tank);
      loot.destroy();
    });

    this.respawnLootAndCrates(time);
  }
}
