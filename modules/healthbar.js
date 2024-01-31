
export class Healthbar {
  constructor (scene, x, y, sizeX, sizeY, offsetY = 0) {
    const color = "0x00ff00";
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.offsetY = offsetY;

    this.outerBox = scene.add.rectangle(x, y, sizeX, sizeY).setStrokeStyle(2, color).setDisplayOrigin(sizeX / 2, -offsetY);
    this.innerFill = scene.add.rectangle(x, y, sizeX, sizeY, color).setDisplayOrigin(sizeX / 2, -offsetY);
  }

  hide() {
    this.outerBox.setVisible(false);
    this.innerFill.setVisible(false);
  }

  reveal() {
    this.outerBox.setVisible(true);
    this.innerFill.setVisible(true);
  }

  setPercentage(percentage) {
    this.innerFill
      .setSize(this.sizeX * Math.min(Math.max(percentage, 0), 1), this.sizeY)
      .setDisplayOrigin(this.sizeX / 2, -this.offsetY);
    return this;
  }

  updatePosition(x, y) {
    this.outerBox.setPosition(x, y);
    this.innerFill.setPosition(x, y);
  }

  destroy() {
    this.outerBox.destroy();
    this.innerFill.destroy();
  }
}
