import PixelWarsCore from "pixel-wars-core"
import PixelWarsServer from "pixel-wars-server"

const server = new PixelWarsServer(new PixelWarsCore(true))
server.start(3000)
