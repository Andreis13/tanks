
export class Joystick {
  constructor(joystickContainerElement, changeCallback) {
    this.containerElement = joystickContainerElement;
    this.knobElement = this.containerElement.getElementsByClassName("joystick-knob")[0]
    this.knobPosition = { x: 0, y: 0 };
    this.previousKnobPosition = { x: 0, y: 0 };
    this.changeCallback = changeCallback;

    this.setupElements();

    this.hammer = new Hammer(this.knobElement);
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    window.addEventListener("resize", (event) => {
      console.log("resize");
      this.setupElements();
    });

    this.hammer.on('panstart', (event) => {
      // console.log("pan start");
      this.knobElement.style.transition = "all 0.0s";
      this.moveKnob(event.deltaX, event.deltaY);
      this.runChangeCallback();
    });

    this.hammer.on('panmove', (event) => {
      // console.log("pan move");
      // console.log(this.knobPosition);
      this.moveKnob(event.deltaX, event.deltaY);
      this.runChangeCallback();
    });

    this.hammer.on('panend', (event) => {
      // console.log("pan end");
      this.resetknob();
      this.runChangeCallback();
    });
  }

  setupElements () {
    // this.containerElement.height("100%");
    // this.containerElement.width("100%");

    this.squaredMaxRadius;

    let containerSize = Math.min(this.containerElement.offsetWidth, this.containerElement.offsetHeight);

    // how far can the joystick knob move from the center of the container
    // the multiplier is chosen manually/visually
    let maxRadius = containerSize * 0.25;
    this.squaredMaxRadius = maxRadius * maxRadius; // more convenient for calculations

    // this.container.outerWidth(size);
    // this.container.outerHeight(size);

    // TODO: Choose between css and js for controlling the size and initial positioning of the elements
    let knobSize = containerSize * 0.25;
    this.knobElement.style.width = knobSize.toString() + "px"
    this.knobElement.style.height = knobSize.toString() + "px"

    let knobOffset = (containerSize - knobSize) / 2;
    this.knobElement.style.left = Math.round(knobOffset).toString() + "px"
    this.knobElement.style.top = Math.round(knobOffset).toString() + "px"
  }

  moveKnob (x, y) {
    this.knobPosition = this.enforceKnobBoundaries({ x: x, y: y });
    this.requestRedraw();
  }

  enforceKnobBoundaries (vec) {
    let sqLength = this.squareLength(vec);
    if (sqLength <= this.squaredMaxRadius) {
      return vec;
    }

    let k = Math.sqrt(this.squaredMaxRadius / sqLength);

    return { x: Math.round(vec.x * k), y: Math.round(vec.y * k) };
  }

  requestRedraw () {
    // let ticking
    // if (!this.ticking) {
      // figure out why requestAnimationFrame and this.ticking is required
      window.requestAnimationFrame(() => {
        let value = "translate(" + this.knobPosition.x + "px," + this.knobPosition.y + "px)";
        this.knobElement.style.transform = value;
        // this.ticking = false;
      });
      // this.ticking = true;
    // }
  }

  squareLength (vec) {
    return vec.x * vec.x + vec.y * vec.y;
  }

  resetknob () {
    this.knobElement.style.transition = "all 0.3s";
    this.knobPosition = { x: 0, y: 0 };
    this.requestRedraw();
  }

  runChangeCallback () {
    if (this.previousKnobPosition.x != this.knobPosition.x || this.previousKnobPosition.y != this.knobPosition.y) {
      this.changeCallback(this);
      this.previousKnobPosition = this.knobPosition;
    }
  }

  // normalizeCoords (vec) {
  //       return {
  //         x: Math.round(vec.x * 100.0 / this.clampRadius),
  //         y: Math.round(vec.y * 100.0 / this.clampRadius)
  //       };
  //     }
}
