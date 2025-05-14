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
    this.socket = io(`ws://${ip}`)
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
      const result = await fetch(`http://${ip}/pixel-wars/server-info`)

      if (!result.ok)
        return { validPixelWarsServer: false }

      return await result.json()
    } catch(err) {
      console.error(err)
      return { validPixelWarsServer: false }
    }
  }

  init(client: PixelWarsClient) {
    this.socket.on(PACKET_PREFIX + "setPixelTypes", (pixelTypes: PixelType[]) => {
      client.getClientWorld().setPixelTypes(pixelTypes)
    })

    this.socket.on(PACKET_PREFIX + "setColourInventory", (colourInventory: number[]) => {
      client.getPlayer().setColourInventory(colourInventory)
    })

    this.socket.on(PACKET_PREFIX + "setPixel", (x: number, y: number, pixel: WorldPixel) => {
      console.log(pixel)
      console.log(x)
      console.log(y)
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

  emit(message: string, ...args: unknown[]) {
    this.socket.emit(PACKET_PREFIX + message, ...args)
  }

  emitJoin() {
    this.emit("join")
  }

  emitPlacePixel(x: number, y: number, pixel: WorldPixel) {
    this.emit("placePixel", x, y, pixel)
  }
}
