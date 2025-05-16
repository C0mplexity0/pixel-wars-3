import PixelWarsEvent from "pixel-wars-core/event";
import type { PixelType, WorldPixel } from "pixel-wars-core/world";
import { io, Socket } from "socket.io-client";
import type PixelWarsClient from "..";

export const PACKET_PREFIX = "pw-"

export default class ConnectionHandler {
  private socket: Socket

  private onSuccessEvent: PixelWarsEvent<Parameters<() => void>>;
  private onSuccessEventCalled: boolean

  constructor(ip: string) {
    this.socket = io(`https://${ip}`)
    this.socket.on(PACKET_PREFIX + "connected", () => {
      if (!this.onSuccessEventCalled) {
        this.onSuccessEvent.fire()
        this.onSuccessEventCalled = true
      }
    })

    this.onSuccessEvent = new PixelWarsEvent()
    this.onSuccessEventCalled = false
  }

  static async getServerInfo(ip: string) {
    try {
      const result = await fetch(`https://${ip}/pixel-wars/server-info`)

      if (!result.ok)
        return { validPixelWarsServer: false }

      return await result.json()
    } catch(err) {
      console.error(err)
      return { validPixelWarsServer: false }
    }
  }

  getSocket() {
    return this.socket
  }

  init(client: PixelWarsClient) {
    this.socket.on(PACKET_PREFIX + "setPixelTypes", (pixelTypes: PixelType[]) => {
      client.getClientWorld().setPixelTypes(pixelTypes)
    })

    this.socket.on(PACKET_PREFIX + "setColourInventory", (colourInventory: number[]) => {
      client.getPlayer().setColourInventory(colourInventory)
    })

    this.socket.on(PACKET_PREFIX + "setPixel", (x: number, y: number, pixel: WorldPixel) => {
      client.getClientWorld().setPixel(x, y, pixel)
    })
  }

  disconnect() {
    this.socket.disconnect()
  }

  firstConnected() {
    return this.onSuccessEventCalled
  }

  connected() {
    return this.socket.connected
  }

  onSuccess(callback: () => void) {
    this.onSuccessEvent.addListener(callback)
  }

  offSuccess(callback: () => void) {
    this.onSuccessEvent.removeListener(callback)
  }
}
