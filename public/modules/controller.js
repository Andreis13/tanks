
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
        console.log(joystick.knobPosition);
        dataConnection.send(joystick.knobPosition); // send stuff over the network
      }
    );

  });

};
