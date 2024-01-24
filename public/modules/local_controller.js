export class LocalController {
  constructor (scene) {
    this.keyboardControls = scene.input.keyboard.createCursorKeys();
    this.shootKey = scene.input.keyboard.addKey("A", true, false);

    this.shootKeyWasDown = false;
  }

  get up() {
    return this.keyboardControls.up;
  }

  get down() {
    return this.keyboardControls.down;
  }

  get left() {
    return this.keyboardControls.left;
  }

  get right() {
    return this.keyboardControls.right;
  }

  get shootKeyPressed() { // gotta add a unit test for this type of thing
    if (this.shootKey.isDown) {
      if (this.shootKeyWasDown) {
        this.shootKeyWasDown = true;
        return false;
      } else {
        this.shootKeyWasDown = true;
        return true;
      }
    } else {
      this.shootKeyWasDown = false;
      return false;
    }
  }

}
