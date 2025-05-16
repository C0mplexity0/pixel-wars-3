import type { Socket } from "socket.io-client";
import PacketIn from "../packet-in";

export default class PacketInJoin extends PacketIn {

  constructor(socket: Socket) {
    super("join", [], socket)
  }
}
