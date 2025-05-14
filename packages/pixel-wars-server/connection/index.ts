import * as http from "node:http"
import { Server } from "socket.io"
import express from "express"
import type PixelWarsServer from ".."
import cors from "cors"

export default class ConnectionHandler {
  private httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  private io: Server
  private app: express.Express

  constructor(server: PixelWarsServer, port: number) {
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
      console.log(socket)
    })

    this.httpServer.listen(port, () => {
      console.log("Running PIXEL WARS MULTIPLAYER server")
    })
  }

  disconnect() {
    this.io.close()
    this.httpServer.close()
  }
}
