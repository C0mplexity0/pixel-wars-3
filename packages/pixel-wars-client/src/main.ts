import PixelWarsCore from "pixel-wars-core"
import PixelWarsClient from "./game"
import PixelWarsEvent from "pixel-wars-core/event"

const initEvent = new PixelWarsEvent()

let core: PixelWarsCore
let client: PixelWarsClient

export function getClient() {
  return client
}

export function initSingleplayer() {
  if (initialised())
    return

  const gameCanvas = document.getElementById("game")

  if (!gameCanvas || !(gameCanvas instanceof HTMLCanvasElement))
    return

  core = new PixelWarsCore(false)
  core.start()

  client = new PixelWarsClient(gameCanvas, core)

  initEvent.fire()
}

export function onPixelWarsInit(callback: () => void) {
  initEvent.addListener(callback)
}

export function offPixelWarsInit(callback: () => void) {
  initEvent.removeListener(callback)
}

export function initialised() {
  if (core || client)
    return true

  return false
}
