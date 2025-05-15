import PixelWarsCore from "pixel-wars-core"
import ConnectionHandler from "./connection"
import log4js from "log4js"
import ConnectedPlayer from "./connection/connected-player"
import type { Socket } from "socket.io"
import type World from "pixel-wars-core/world"

export default class PixelWarsServer {

  private core: PixelWarsCore
  private logger: log4js.Logger

  private connection: ConnectionHandler | undefined

  constructor(core: PixelWarsCore) {
    this.core = core
    this.logger = log4js.getLogger("pixel-wars-server")
    this.logger.level = "info"

    const worlds = core.getWorlds()

    for (let i=0;i<worlds.length;i++) {
      this.#initWorld(worlds[i])
    }
  }

  #initWorld(world: World) {
    world.onPixelChange((x, y, pixel) => {
      const players = this.core.getPlayers()
      for (let i=0;i<players.length;i++) {
        const player = players[i]

        if (player instanceof ConnectedPlayer)
          this.connection?.emitSetPixel(player.getSocket(), x, y, pixel)
      }
    })
  }

  getLogger() {
    return this.logger
  }

  getCore() {
    return this.core
  }

  start(port: number, ssl: { key: NonSharedBuffer, cert: NonSharedBuffer }) {
    if (this.connection)
      this.connection.disconnect()

    this.connection = new ConnectionHandler(this, port, ssl)
    this.connection.onConnection((socket: Socket) => {
      this.logger.info("New connection from " + socket.handshake.address)
      socket.emit("pw-connected")
    })

    this.connection.onPlayerJoin((player: ConnectedPlayer) => {
      this.core.addPlayer(player)

      if (!this.connection)
        return

      const socket = player.getSocket()

      this.connection.emitSetPixelTypes(socket, this.core.getDefaultWorld().getPixelTypes())
      this.connection.emitSetColourInventory(socket, player.getColourInventory())
    })
  }
}
