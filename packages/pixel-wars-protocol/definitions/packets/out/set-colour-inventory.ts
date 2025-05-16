import type { Server, Socket } from "socket.io";
import PacketOut from "../packet-out";

export default class PacketOutSetColourInventory extends PacketOut {

  constructor(receiver: Socket | Server, colourInventory: number[]) {
    super("setColourInventory", [colourInventory], receiver)
  }
}
