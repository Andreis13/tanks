export class CursorKeysFromJoystick {

    constructor () {
      this.up = { isDown: false };
      this.down = { isDown: false };
      this.left = { isDown: false };
      this.right = { isDown: false };
    }

    updateFromCoords (x, y) {
      if (x > 20) {
        this.right.isDown = true
      } else {
        this.right.isDown = false
      }

      if (x < -20) {
        this.left.isDown = true
      } else {
        this.left.isDown = false
      }

      if (y > 20) {
        this.down.isDown = true
      } else {
        this.down.isDown = false
      }

      if (y < -20) {
        this.up.isDown = true
      } else {
        this.up.isDown = false
      }

      console.log(this);
    }
  }
