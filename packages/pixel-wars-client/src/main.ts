import PixelWarsClient from "./game"
import ConnectionHandler from "./game/connection"
import { Event, EventHandler, type Listener } from "pixel-wars-core/event"
import type PixelWarsGamemode from "./game/gamemode"

export class MultiplayerConnectionChangeEvent extends Event {
  private message: string

  constructor(message: string) {
    super()
    this.message = message
  }

  getMessage() {
    return this.message
  }
}

const initEvent = new EventHandler<Event>()
const endEvent = new EventHandler<Event>()
const multiplayerConnectionMessageEvent = new EventHandler<MultiplayerConnectionChangeEvent>()
const multiplayerConnectionFailureEvent = new EventHandler<MultiplayerConnectionChangeEvent>()

let gamemode: PixelWarsGamemode | undefined
let client: PixelWarsClient | undefined

export function getClient() {
  return client
}

function getGameCanvas() {
  const gameCanvas = document.getElementById("game")

  if (!gameCanvas || !(gameCanvas instanceof HTMLCanvasElement))
    throw new Error("Could not find canvas")

  return gameCanvas
}

export function initSingleplayer(gamemodeToInit: PixelWarsGamemode) {
  if (initialised())
    return

  const gameCanvas = getGameCanvas()

  gamemode = gamemodeToInit

  client = new PixelWarsClient(gameCanvas, { pixelWarsGamemode: gamemode })

  initEvent.fire(new Event())
}

export async function initMultiplayer(ip: string) {
  if (initialised())
    return

  multiplayerConnectionMessageEvent.fire(new MultiplayerConnectionChangeEvent("Fetching server info..."))

  const serverInfo = await ConnectionHandler.getServerInfo(ip)

  if (!serverInfo.validPixelWarsServer) {
    multiplayerConnectionFailureEvent.fire(new MultiplayerConnectionChangeEvent("Couldn't fetch server info."))
    return
  }

  multiplayerConnectionMessageEvent.fire(new MultiplayerConnectionChangeEvent("Connecting to server..."))

  const handler = new ConnectionHandler(ip)
  handler.onSuccess(() => {
    if (initialised())
      return
  
    client = new PixelWarsClient(getGameCanvas(), { connectionHandler: handler })
    initEvent.fire(new Event())
  })
}

export function onMultiplayerConnectionMessage(callback: Listener<MultiplayerConnectionChangeEvent>) {
  multiplayerConnectionMessageEvent.addListener(callback)
}

export function offMultiplayerConnectionMessage(callback: Listener<MultiplayerConnectionChangeEvent>) {
  multiplayerConnectionMessageEvent.removeListener(callback)
}

export function onMultiplayerConnectionFailure(callback: Listener<MultiplayerConnectionChangeEvent>) {
  multiplayerConnectionFailureEvent.addListener(callback)
}

export function offMultiplayerConnectionFailure(callback: Listener<MultiplayerConnectionChangeEvent>) {
  multiplayerConnectionFailureEvent.removeListener(callback)
}

export function onPixelWarsInit(callback: () => void) {
  initEvent.addListener(callback)
}

export function offPixelWarsInit(callback: () => void) {
  initEvent.removeListener(callback)
}

export function onPixelWarsEnd(callback: () => void) {
  endEvent.addListener(callback)
}

export function offPixelWarsEnd(callback: () => void) {
  endEvent.removeListener(callback)
}

export function initialised() {
  if (gamemode || client)
    return true

  return false
}

export function endGame() {
  if (client)
    client.end()

  client = undefined
  gamemode = undefined

  endEvent.fire(new Event())
}
