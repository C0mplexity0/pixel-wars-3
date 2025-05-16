import type { Socket } from "socket.io-client";
import PacketIn from "../packet-in";
import type { WorldPixel } from "pixel-wars-core/world";

export default class PacketInPlacePixel extends PacketIn {

  constructor(socket: Socket, x: number, y: number, pixel: WorldPixel) {
    super("placePixel", [x, y, pixel], socket)
  }
}
