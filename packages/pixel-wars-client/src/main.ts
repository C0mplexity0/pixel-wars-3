import PixelWarsCore from "pixel-wars-core"
import PixelWarsClient from "./game"

let core: PixelWarsCore
let client: PixelWarsClient

export function getClient() {
  return client
}

export function initGame() {
  if (core && client)
    return

  const gameCanvas = document.getElementById("game")

  if (!gameCanvas || !(gameCanvas instanceof HTMLCanvasElement))
    return

  core = new PixelWarsCore(false)
  core.start()

  client = new PixelWarsClient(gameCanvas, core)
}
