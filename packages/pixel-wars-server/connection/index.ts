import * as https from "node:https"
import { Server, Socket } from "socket.io"
import express from "express"
import type PixelWarsServer from ".."
import cors from "cors"
import ConnectedPlayer from "./connected-player"
import type { WorldPixel } from "pixel-wars-core/world"
import { Event, EventHandler, type Listener } from "pixel-wars-core/event"

export const PACKET_PREFIX = "pw-"

export class ConnectionEvent extends Event {
  private socket: Socket

  constructor(socket: Socket) {
    super()
    this.socket = socket
  }

  getSocket() {
    return this.socket
  }
}

export class PlayerJoinEvent extends Event {
  private player: ConnectedPlayer

  constructor(player: ConnectedPlayer) {
    super()
    this.player = player
  }

  getPlayer() {
    return this.player
  }
}

export default class ConnectionHandler {
  private server: PixelWarsServer
  
  private httpServer: https.Server
  private io: Server
  private app: express.Express

  private onConnectionEvent: EventHandler<ConnectionEvent>
  private onPlayerJoinEvent: EventHandler<PlayerJoinEvent>

  constructor(server: PixelWarsServer, port: number, ssl: { key: NonSharedBuffer, cert: NonSharedBuffer }) {
    this.server = server

    this.onConnectionEvent = new EventHandler()
    this.onPlayerJoinEvent = new EventHandler()

    this.app = express()
    this.httpServer = https.createServer(ssl, this.app)
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    this.app.use(cors())

    this.app.get("/pixel-wars/server-info", (_req, res) => {
      res.json({
        validPixelWarsServer: true
      })
    })

    this.io.on("connection", (socket: Socket) => {
      this.#initSocket(socket)
      const event = new ConnectionEvent(socket)
      this.onConnectionEvent.fire(event)
    })

    this.httpServer.listen(port, () => {
      server.getLogger().info("Running PIXEL WARS MULTIPLAYER server")
    })
  }

  #initSocket(socket: Socket) {
    socket.on(PACKET_PREFIX + "join", () => {
      const player = new ConnectedPlayer(this.server.getCore(), socket)
      const event = new PlayerJoinEvent(player)
      this.onPlayerJoinEvent.fire(event)
    })

    socket.on(PACKET_PREFIX + "placePixel", (x: number, y: number, pixel: WorldPixel) => {
      const player = ConnectedPlayer.getConnectedPlayerFromSocket(socket)
      player?.getWorld().setPixel(x, y, pixel)
    })
  }

  onPlayerJoin(callback: Listener<PlayerJoinEvent>) {
    this.onPlayerJoinEvent.addListener(callback)
  }

  offPlayerJoin(callback: Listener<PlayerJoinEvent>) {
    this.onPlayerJoinEvent.removeListener(callback)
  }

  onConnection(callback: Listener<ConnectionEvent>) {
    this.onConnectionEvent.addListener(callback)
  }

  offConnection(callback: Listener<ConnectionEvent>) {
    this.onConnectionEvent.removeListener(callback)
  }

  disconnect() {
    this.io.close()
    this.httpServer.close()
  }
}
