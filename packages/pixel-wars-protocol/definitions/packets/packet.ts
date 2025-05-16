import { PROTOCOL_DEFINITIONS } from "..";

export default class Packet {
  private name: string;
  protected args: any[]

  constructor(name: string, args: any[]) {
    this.name = name
    this.args = args
  }

  getName() {
    return this.name
  }

  getPrefixedName() {
    return PROTOCOL_DEFINITIONS.packetPrefix + this.name
  }
}
