import PixelWarsCore from "pixel-wars-core"
import PixelWarsClient from "./game"
import PixelWarsEvent from "pixel-wars-core/event"
import ConnectionHandler from "./game/connection"

const initEvent = new PixelWarsEvent()

let core: PixelWarsCore
let client: PixelWarsClient

export function getClient() {
  return client
}

function getGameCanvas() {
  const gameCanvas = document.getElementById("game")

  if (!gameCanvas || !(gameCanvas instanceof HTMLCanvasElement))
    throw new Error("Could not find canvas")

  return gameCanvas
}

export function initSingleplayer() {
  if (initialised())
    return

  const gameCanvas = getGameCanvas()

  core = new PixelWarsCore(false)
  core.start()

  client = new PixelWarsClient(gameCanvas, { pixelWarsCore: core })

  initEvent.fire()
}

export function initMultiplayer(ip: string) {
  if (initialised())
    return

  const handler = new ConnectionHandler(ip)
  handler.onSuccess(() => {
    if (initialised())
      return
  
    client = new PixelWarsClient(getGameCanvas(), { connectionHandler: handler })
  })
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
