import PixelWarsCore from "pixel-wars-core"
import ConnectionHandler from "./connection"

export default class PixelWarsServer {

  private core: PixelWarsCore

  private connection: ConnectionHandler | undefined

  constructor(core: PixelWarsCore) {
    this.core = core
  }

  start(port: number) {
    if (this.connection)
      this.connection.disconnect()

    this.connection = new ConnectionHandler(this, port)
  }
}
