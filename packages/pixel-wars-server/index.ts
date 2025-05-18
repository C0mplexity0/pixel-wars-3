import PixelWarsCore from "pixel-wars-core"
import ConnectionHandler from "./connection"
import log4js from "log4js"
import ConnectedPlayer from "./connection/connected-player"
import type World from "pixel-wars-core/world"
import PacketOutSetPixel from "pixel-wars-protocol/definitions/packets/out/set-pixel"
import PacketOutSetPixelTypes from "pixel-wars-protocol/definitions/packets/out/set-pixel-types"
import PacketOutSetPixelInventory from "pixel-wars-protocol/definitions/packets/out/set-colour-inventory"
import PacketOutConnected from "pixel-wars-protocol/definitions/packets/out/connected"

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
    world.onPixelChange((event) => {
      const players = this.core.getPlayers()
      for (let i=0;i<players.length;i++) {
        const player = players[i]

        if (!(player instanceof ConnectedPlayer))
          return

        const pos = event.getPosition()
        const packet = new PacketOutSetPixel(player.getSocket(), pos[0], pos[1], event.getWorldPixel())
        packet.send()
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
    this.connection.onConnection((event) => {
      const socket = event.getSocket()
      this.logger.info("New connection from " + socket.handshake.address)
    
      const packet = new PacketOutConnected(socket)
      packet.send()
    })

    this.connection.onPlayerJoin((event) => {
      const player = event.getPlayer()
      this.core.addPlayer(player)

      this.getLogger().info("Player joined from " + player.getSocket().handshake.address)

      const socket = player.getSocket()

      const packet1 = new PacketOutSetPixelTypes(socket, this.core.getDefaultWorld().getPixelTypes())
      const packet2 = new PacketOutSetPixelInventory(socket, player.getPixelInventory())
      
      packet1.send()
      packet2.send()
    })
  }
}
