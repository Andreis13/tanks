
import { Joystick } from "./joystick.js";

window.onload = (event) => {
  let urlParams = new URLSearchParams(window.location.search)
  let hubId = urlParams.get("hub_id");
  console.log(hubId);

  let satellite = new Peer({ debug: 2 });

  satellite.on('error', (err) => {
    console.log(err.type);
  });

  satellite.on("open", () => {
    let dataConnection = satellite.connect(hubId);

    let joystick = new Joystick(
      document.getElementById("joystick"),
      (joystick) => {
        dataConnection.send({ joystick: joystick.knobPosition }); // send stuff over the network
      }
    );

    let button = document.getElementById("btn-a")

    let pressCallback = (event) => {
      dataConnection.send({ buttons: { a_down: true } });
      button.classList.add("pressed");
    };

    button.addEventListener("touchstart", pressCallback);
    button.addEventListener("mousedown", pressCallback);

    let releaseCallback = (event) => {
      dataConnection.send({ buttons: { a_down: false } });
      button.classList.remove("pressed");
      // absorb_event(event);
    };

    button.addEventListener("touchend", releaseCallback);
    button.addEventListener("mouseup", releaseCallback);
  });

};
