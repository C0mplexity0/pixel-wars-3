import PixelWarsCore from "pixel-wars-core"
import ConnectionHandler from "./connection"
import log4js from "log4js"

export default class PixelWarsServer {

  private core: PixelWarsCore
  private logger: log4js.Logger

  private connection: ConnectionHandler | undefined

  constructor(core: PixelWarsCore) {
    this.core = core
    this.logger = log4js.getLogger("pixel-wars-server")
    this.logger.level = "info"
  }

  getLogger() {
    return this.logger
  }

  start(port: number) {
    if (this.connection)
      this.connection.disconnect()

    this.connection = new ConnectionHandler(this, port)
    this.connection.onConnection((socket) => {
      this.logger.info("New connection from " + socket.handshake.address)
    })
  }
}
