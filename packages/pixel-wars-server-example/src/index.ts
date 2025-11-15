import PixelWarsCore from "pixel-wars-core"
import PixelWarsServer from "pixel-wars-server"
import fs from "node:fs"

const privateKey = fs.readFileSync("./ssl/server.key")
const certificate = fs.readFileSync("./ssl/server.cert")

const server = new PixelWarsServer(new PixelWarsCore(true))
server.start(3000, {
  key: privateKey,
  cert: certificate,
})
