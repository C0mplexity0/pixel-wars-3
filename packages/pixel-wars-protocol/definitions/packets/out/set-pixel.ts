import type { Server, Socket } from "socket.io";
import PacketOut from "../packet-out";
import type { WorldPixel } from "pixel-wars-core/world";

export default class PacketOutSetPixel extends PacketOut {

  constructor(receiver: Socket | Server, x: number, y: number, pixel: WorldPixel) {
    super("setPixel", [x, y, pixel], receiver)
  }
}
