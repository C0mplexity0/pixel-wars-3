import * as http from "node:http"
import { Server, Socket } from "socket.io"
import express from "express"
import type PixelWarsServer from ".."
import cors from "cors"
import PixelWarsEvent from "pixel-wars-core/event"

export const PACKET_PREFIX = "pw-"

export default class ConnectionHandler {
  private httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  private io: Server
  private app: express.Express

  private onConnectionEvent: PixelWarsEvent

  constructor(server: PixelWarsServer, port: number) {
    this.onConnectionEvent = new PixelWarsEvent

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

    this.io.on("connection", (socket) => {
      this.onConnectionEvent.fire(socket)
    })

    this.httpServer.listen(port, () => {
      server.getLogger().info("Running PIXEL WARS MULTIPLAYER server")
    })
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
}
