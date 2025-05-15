import PixelWarsCore from "pixel-wars-core"
import PixelWarsServer from "pixel-wars-server"
import fs from "node:fs"

const privateKey = fs.readFileSync("./ssl/key.pem")
const certificate = fs.readFileSync("./ssl/cert.pem")

const server = new PixelWarsServer(new PixelWarsCore(true))
server.start(3000, {
  key: privateKey,
  cert: certificate,
})
