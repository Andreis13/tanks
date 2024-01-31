
export class Grid {
  constructor(gridTileSize) {
    this.tileSize = gridTileSize;
  }

  tileCoordX(numberX) {
    return numberX * this.tileSize;
  }

  tileCoordY(numberY) {
    return numberY * this.tileSize;
  }

  tileCenterCoordX(numberX) {
    return (numberX + 0.5) * this.tileSize;
  }

  tileCenterCoordY(numberY) {
    return (numberY + 0.5) * this.tileSize;
  }

  tileNumberX(coordX) {
    return Math.floor(coordX / this.tileSize);
  }

  tileNumberY(coordY) {
    return Math.floor(coordY / this.tileSize);
  }
}
