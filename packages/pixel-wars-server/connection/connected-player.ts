import type PixelWarsCore from "pixel-wars-core";
import Player from "pixel-wars-core/player";
import type { Socket } from "socket.io";

const connectedPlayers: ConnectedPlayer[] = []

export default class ConnectedPlayer extends Player {

  private socket: Socket

  constructor(core: PixelWarsCore, socket: Socket) {
    super(core)

    if (ConnectedPlayer.getConnectedPlayerFromSocket(socket)) {
      throw new Error("Player with socket id " + socket.id + " is already registered as a connected player")
    }

    this.socket = socket

    connectedPlayers.push(this)
  }

  static getConnectedPlayerFromSocket(socket: Socket) {
    for (let i=0;i<connectedPlayers.length;i++) {
      if (connectedPlayers[i].getSocket().id === socket.id)
        return connectedPlayers[i]
    }

    return
  }

  getSocket() {
    return this.socket
  }
}
