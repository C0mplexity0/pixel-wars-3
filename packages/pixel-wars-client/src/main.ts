import PixelWarsCore from "pixel-wars-core"
import PixelWarsClient from "./game"
import PixelWarsEvent from "pixel-wars-core/event"
import ConnectionHandler from "./game/connection"

const initEvent = new PixelWarsEvent()
const multiplayerConnectionMessageEvent = new PixelWarsEvent()
const multiplayerConnectionFailureEvent = new PixelWarsEvent()

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

export async function initMultiplayer(ip: string) {
  if (initialised())
    return

  multiplayerConnectionMessageEvent.fire("Fetching server info...")

  const serverInfo = await ConnectionHandler.getServerInfo(ip)

  if (!serverInfo.validPixelWarsServer) {
    multiplayerConnectionFailureEvent.fire("Couldn't fetch server info.")
    return
  }

  multiplayerConnectionMessageEvent.fire("Connecting to server...")

  const handler = new ConnectionHandler(ip)
  handler.onSuccess(() => {
    if (initialised())
      return
  
    client = new PixelWarsClient(getGameCanvas(), { connectionHandler: handler })
    initEvent.fire()
  })
}

export function onMultiplayerConnectionMessage(callback: (message: string) => void) {
  multiplayerConnectionMessageEvent.addListener(callback)
}

export function offMultiplayerConnectionMessage(callback: (message: string) => void) {
  multiplayerConnectionMessageEvent.removeListener(callback)
}

export function onMultiplayerConnectionFailure(callback: (message: string) => void) {
  multiplayerConnectionFailureEvent.addListener(callback)
}

export function offMultiplayerConnectionFailure(callback: (message: string) => void) {
  multiplayerConnectionFailureEvent.removeListener(callback)
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
