import type { Server, Socket } from "socket.io";
import Packet from "./packet";

export default class PacketOut extends Packet {

  private receiver: Socket | Server
  private sent: boolean
  
  constructor(name: string, args: any[], receiver: Socket | Server) {
    super(name, args)

    this.receiver = receiver
    this.sent = false
  }

  send() {
    if (this.sent)
      return

    this.sent = true
    this.receiver.emit(this.getPrefixedName(), ...this.args)
  }
}
