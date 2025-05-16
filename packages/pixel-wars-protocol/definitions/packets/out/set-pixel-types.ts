import type { Server, Socket } from "socket.io";
import PacketOut from "../packet-out";
import type { PixelType } from "pixel-wars-core/world";

export default class PacketOutSetPixelTypes extends PacketOut {

  constructor(receiver: Socket | Server, pixelTypes: PixelType[]) {
    super("setPixelTypes", [pixelTypes], receiver)
  }
}
