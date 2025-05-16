import type { Server, Socket } from "socket.io";
import PacketOut from "../packet-out";

export default class PacketOutConnected extends PacketOut {

  constructor(receiver: Socket | Server) {
    super("connected", [], receiver)
  }
}
