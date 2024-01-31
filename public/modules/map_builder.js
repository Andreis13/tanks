import { Grid } from "./grid.js";

class TileSelector {
  constructor(elementName) {
    this.elements = document.getElementsByName(elementName);
  }

  get selection() {
    for (const radio of this.elements.values()) {
      if (radio.checked) {
        return radio.value;
      }
    };
    return null;
  }
}

class MapBuilder extends Phaser.Scene {
  constructor(tileSelector) {
    super();
    this.tileSelector = tileSelector;
    this.grid = new Grid(50);
  }

  preload () {
    this.load.image("tank", "assets/panthera.png");
    this.load.image("crate", "assets/crate.png");
    this.load.image("brick", "assets/brick.png");
    this.load.image("metal", "assets/metal.png");
    this.load.image("ammo", "assets/ammo.png");
    this.load.image("medkit", "assets/medkit.png");
  }

  create() {
    this.add.grid(500, 500, 1000, 1000, 50, 50).setOutlineStyle(0xffffff, 0.2)

    this.input.on("pointerdown", (pointer) => {
      this.handleClick(pointer.x, pointer.y);
    });
  }

  handleClick(x, y) {
    console.log(this.tileSelector.selection);
    console.log(this.grid.tileNumberX(x), this.grid.tileNumberY(y));

    let tx = this.grid.tileNumberX(x);
    let ty = this.grid.tileNumberY(y);

    this.tileMap ||= {};
    this.tileMap[tx] ||= {};

    if (this.tileMap[tx][ty]) {
      this.tileMap[tx][ty].image.destroy();
      this.tileMap[tx][ty] = undefined;
    } else {
      let name = this.tileSelector.selection;
      let img = this.add.image(
        this.grid.tileCenterCoordX(tx),
        this.grid.tileCenterCoordY(ty),
        this.tileSelector.selection
      ).setDisplaySize(this.grid.tileSize, this.grid.tileSize)

      this.tileMap[tx][ty] = { name: name, image: img };
    }
  }

  getPublishableMap() {
    let publishableMap = {};
    for (const [tx, row] of Object.entries(this.tileMap)) {
      for (const [ty, tile] of Object.entries(row)) {
        if (tile) {
          publishableMap[tile.name] ||= [];
          publishableMap[tile.name].push([parseInt(tx), parseInt(ty)]);
        }
      }
    }

    return publishableMap;
  }
}


window.onload = (event) => {
  let tileSelector = new TileSelector("tileType");
  let scene = new MapBuilder(tileSelector);

  document.getElementById("copy-button").addEventListener("click", () => {
    navigator.clipboard.writeText(JSON.stringify(scene.getPublishableMap())).then(() => {
      alert("coppied to clipboard");
    });
  })

  let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
    scene: scene,
    parent: "game-viewport",
    physics: {
      default: "arcade",
      arcade: {
        debug: true
      }
    }
  }

  new Phaser.Game(config);
}
