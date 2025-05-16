import type { Socket } from "socket.io-client"
import Packet from "./packet";

export default class PacketIn extends Packet {

  private socket: Socket
  private sent: boolean
  
  constructor(name: string, args: any[], socket: Socket) {
    super(name, args)

    this.socket = socket
    this.sent = false
  }

  send() {
    if (this.sent)
      return

    this.sent = true
    this.socket.emit(this.getPrefixedName(), ...this.args)
  }
}
