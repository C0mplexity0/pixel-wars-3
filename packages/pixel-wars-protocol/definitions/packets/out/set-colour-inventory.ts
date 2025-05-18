import type { Server, Socket } from "socket.io";
import PacketOut from "../packet-out";

export default class PacketOutSetPixelInventory extends PacketOut {

  constructor(receiver: Socket | Server, pixelInventory: number[]) {
    super("setPixelInventory", [pixelInventory], receiver)
  }
}
