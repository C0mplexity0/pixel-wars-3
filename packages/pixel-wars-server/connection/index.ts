import * as http from "node:http"
import { Server } from "socket.io"

export default class ConnectionHandler {
  private httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  private io: Server

  constructor(port: number) {
    this.httpServer = http.createServer()
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
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
