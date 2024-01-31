export class RemoteController {
  constructor (peerConnection) {
    this.up = { isDown: false };
    this.down = { isDown: false };
    this.left = { isDown: false };
    this.right = { isDown: false };
    this.shootKey = { isDown: false };

    peerConnection.on('data', (data) => {
      this.updateStateFromData(data);
    });
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

  updateStateFromData(data) {
    if (data.joystick) { this.updateFromJoystick(data.joystick); }
    if (data.buttons) { this.updateFromButtons(data.buttons); }
  }

  updateFromJoystick(joystickData) {
    let x = joystickData.x;
    let y = joystickData.y;

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
  }

  updateFromButtons(buttonsData) {
    if (buttonsData.a_down) {
      this.shootKey.isDown = true;
    } else {
      this.shootKey.isDown = false;
    }
  }
}
