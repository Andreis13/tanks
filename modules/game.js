
import { Tanks } from "./tanks.js";
import { RemoteController } from "./remote_controller.js";

window.onload = (event) => {
  let hub = new Peer({ debug: 2 });

  hub.on('open', (id) => {
    let connectUrl = "http://192.168.178.219:8080/controller?hub_id=" + id

    new QRCode(document.getElementById("connect-qr-code"), connectUrl);

    document.getElementById("hub-id").innerHTML = id;
    document.getElementById("connect-link").href = connectUrl;
  });

  let connections = [];

  hub.on('connection', (dataConnection) => {
    console.log("peer connected");
    console.log(dataConnection)
    // $('#connections').append('<li>'+ dataConnection.metadata.player_name + ' : ' + dataConnection.label +'</li>');
    connections.push(dataConnection);

    let listItem = document.createElement("li");
    listItem.append(document.createTextNode(dataConnection.label));

    document.getElementById("connections-list").append(listItem);
  });

  document.getElementById("start-game").addEventListener("click", () => {
    let remoteControllers = connections.map((conn) => new RemoteController(conn));

    document.getElementById("lobby").remove();

    let config = {
      type: Phaser.AUTO,
      width: 1000,
      height: 1000,
      scene: new Tanks(remoteControllers),
      parent: "game-viewport",
      physics: {
        default: "arcade",
        arcade: {
          debug: true
        }
      }
    }

    new Phaser.Game(config);
  });




};
