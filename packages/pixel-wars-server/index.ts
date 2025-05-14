import PixelWarsCore from "pixel-wars-core"
import ConnectionHandler from "./connection"
import log4js from "log4js"
import type ConnectedPlayer from "./connection/connected-player"
import type { Socket } from "socket.io"

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

  getCore() {
    return this.core
  }

  start(port: number) {
    if (this.connection)
      this.connection.disconnect()

    this.connection = new ConnectionHandler(this, port)
    this.connection.onConnection((socket: Socket) => {
      this.logger.info("New connection from " + socket.handshake.address)
      socket.emit("pw-connected")
    })

    this.connection.onPlayerJoin((player: ConnectedPlayer) => {
      this.core.addPlayer(player)
    })
  }
}
