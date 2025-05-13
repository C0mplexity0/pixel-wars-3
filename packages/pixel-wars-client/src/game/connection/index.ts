import PixelWarsEvent from "pixel-wars-core/event";
import { io, Socket } from "socket.io-client";

export default class ConnectionHandler {
  private socket: Socket

  private onSuccessEvent: PixelWarsEvent;
  private onSuccessEventCalled: boolean

  constructor(ip: string) {
    this.socket = io(ip)
    this.socket.on("connect", () => {
      if (!this.onSuccessEventCalled) {
        this.onSuccessEvent.fire()
        this.onSuccessEventCalled = true
      }
    })

    this.onSuccessEvent = new PixelWarsEvent()
    this.onSuccessEventCalled = false
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
