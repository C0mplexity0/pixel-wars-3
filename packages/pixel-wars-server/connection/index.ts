import * as http from "node:http"
import { Server, Socket } from "socket.io"
import express from "express"
import type PixelWarsServer from ".."
import cors from "cors"
import PixelWarsEvent from "pixel-wars-core/event"
import ConnectedPlayer from "./connected-player"
import type { PixelType, WorldPixel } from "pixel-wars-core/world"

export const PACKET_PREFIX = "pw-"

export default class ConnectionHandler {
  private server: PixelWarsServer
  
  private httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  private io: Server
  private app: express.Express

  private onConnectionEvent: PixelWarsEvent<Parameters<(socket: Socket) => void>>
  private onPlayerJoinEvent: PixelWarsEvent<Parameters<(player: ConnectedPlayer) => void>>

  constructor(server: PixelWarsServer, port: number) {
    this.server = server

    this.onConnectionEvent = new PixelWarsEvent()
    this.onPlayerJoinEvent = new PixelWarsEvent()

    this.app = express()
    this.httpServer = http.createServer(this.app)
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
      this.onConnectionEvent.fire(socket)
    })

    this.httpServer.listen(port, () => {
      server.getLogger().info("Running PIXEL WARS MULTIPLAYER server")
    })
  }

  #initSocket(socket: Socket) {
    socket.on(PACKET_PREFIX + "join", () => {
      const player = new ConnectedPlayer(this.server.getCore(), socket)
      this.onPlayerJoinEvent.fire(player)
    })

    socket.on(PACKET_PREFIX + "placePixel", (x: number, y: number, pixel: WorldPixel) => {
      const player = ConnectedPlayer.getConnectedPlayerFromSocket(socket)
      player?.getWorld().setPixel(x, y, pixel)
    })
  }

  onPlayerJoin(callback: (player: ConnectedPlayer) => void) {
    this.onPlayerJoinEvent.addListener(callback)
  }

  offPlayerJoin(callback: (player: ConnectedPlayer) => void) {
    this.onPlayerJoinEvent.removeListener(callback)
  }

  onConnection(callback: (socket: Socket) => void) {
    this.onConnectionEvent.addListener(callback)
  }

  offConnection(callback: (socket: Socket) => void) {
    this.onConnectionEvent.removeListener(callback)
  }

  disconnect() {
    this.io.close()
    this.httpServer.close()
  }

  emit(socket: Socket, message: string, ...args: unknown[]) {
    socket.emit(`pw-${message}`, ...args)
  }

  emitConnected(socket: Socket) {
    this.emit(socket, "connected")
  }

  emitSetPixel(socket: Socket, x: number, y: number, pixel: WorldPixel) {
    this.emit(socket, "setPixel", x, y, pixel)
  }

  emitSetPixelTypes(socket: Socket, pixelTypes: PixelType[]) {
    this.emit(socket, "setPixelTypes", pixelTypes)
  }

  emitSetColourInventory(socket: Socket, colourInventory: number[]) {
    this.emit(socket, "setColourInventory", colourInventory)
  }
}
