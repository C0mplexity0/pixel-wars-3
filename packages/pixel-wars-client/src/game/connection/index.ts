import PixelWarsEvent from "pixel-wars-core/event";
import { io, Socket } from "socket.io-client";

export default class ConnectionHandler {
  private socket: Socket

  private onSuccessEvent: PixelWarsEvent;
  private onSuccessEventCalled: boolean

  constructor(ip: string) {
    this.socket = io(`ws://${ip}`)
    this.socket.on("connect", () => {
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
