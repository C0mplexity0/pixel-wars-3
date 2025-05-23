import LocalPlayer from "./player/local-player"
import Renderer, { VISIBLE_PIXEL_RADIUS, type NonPixelRenderer } from "./renderer"
import ClientWorld from "./world/client-world"
import ControlsHandler from "./player/controls"
import MovementHandler from "./player/movement"
import BuildingHandler from "./world/building"
import Player from "pixel-wars-core/player"
import type ConnectionHandler from "./connection"
import PacketInJoin from "pixel-wars-protocol/definitions/packets/in/join"
import { Event, EventHandler, type Listener } from "pixel-wars-core/event"
import DebugRenderer from "./debug/debug-renderer"
import type PixelWarsGamemode from "./gamemode"
import PixelWarsCore, { SettingsUpdatedEvent } from "pixel-wars-core"

interface ClientOptions {
  pixelWarsGamemode?: PixelWarsGamemode,
  connectionHandler?: ConnectionHandler
}

export class UpdateEvent extends Event {
  private deltaTime: number

  constructor(deltaTime: number) {
    super()

    this.deltaTime = deltaTime
  }

  getDeltaTime() {
    return this.deltaTime
  }
}

export class DebugModeToggleEvent extends Event {
  private enabled: boolean

  constructor(enabled: boolean) {
    super()

    this.enabled = enabled
  }

  debugModeEnabled() {
    return this.enabled
  }
}

export default class PixelWarsClient {
  private running: boolean

  private pixelWarsGamemode?: PixelWarsGamemode
  private connectionHandler?: ConnectionHandler

  private debugModeEnabled: boolean
  private debugRenderer: DebugRenderer

  private canvas: HTMLCanvasElement

  private renderer: Renderer
  private world: ClientWorld
  private player: LocalPlayer
  private movementHandler: MovementHandler
  private controlsHandler: ControlsHandler
  private buildingHandler: BuildingHandler

  private lastUpdate: number

  private onUpdateEvent: EventHandler<UpdateEvent>
  private onDebugModeToggleEvent: EventHandler<DebugModeToggleEvent>
  private onSettingsUpdatedEvent: EventHandler<SettingsUpdatedEvent>

  constructor(canvas: HTMLCanvasElement, options?: ClientOptions) {
    if (options?.pixelWarsGamemode && options.connectionHandler)
      throw new Error("Both the PIXEL WARS CORE and a connection handler have been passed to the client. Only one should be passed (the core if in singleplayer, and the connection handler if in multiplayer).")

    console.info("STARTING PIXEL WARS CLIENT")

    this.running = true

    if (!options)
      options = {}

    this.pixelWarsGamemode = options.pixelWarsGamemode

    if (this.pixelWarsGamemode) {
      this.pixelWarsGamemode.addPlayer(new Player(this.pixelWarsGamemode.getCore()))
      this.pixelWarsGamemode.getCore().onSettingsUpdated((settings) => {
        this.onSettingsUpdatedEvent.fire(settings)
      })
    }

    this.connectionHandler = options.connectionHandler

    if (this.connectionHandler) {
      this.connectionHandler.init(this)
      this.connectionHandler.onSuccess(() => {
        if (!this.connectionHandler)
          return

        new PacketInJoin(this.connectionHandler.getSocket()).send()
      })
    }

    this.debugModeEnabled = false
    this.debugRenderer = new DebugRenderer(this)
    
    this.canvas = canvas

    this.renderer = new Renderer(this)
    this.world = new ClientWorld(this)
    this.player = new LocalPlayer(this)

    this.movementHandler = new MovementHandler(this, this.player)
    this.controlsHandler = new ControlsHandler()
    this.buildingHandler = new BuildingHandler(this)

    this.lastUpdate = Date.now()

    this.onUpdateEvent = new EventHandler()
    this.onDebugModeToggleEvent = new EventHandler()
    this.onSettingsUpdatedEvent = new EventHandler()

    window.addEventListener("keyup", (event) => {
      if (event.key.toLowerCase() === "d" && event.ctrlKey && event.altKey) {
        event.preventDefault()
        this.debugModeEnabled = !this.debugModeEnabled
        this.#sendDebugModeToggleEvent()
      }
    })

    setTimeout(() => {
      this.#update()
    }, 0)
  }

  end() {
    this.running = false

    if (this.connectionHandler)
      this.connectionHandler.disconnect()

    this.renderer.clearCanvas()
  }

  getSettings() {
    const core = this.getSingleplayerCore()

    if (core)
      return core.getSettings()

    return PixelWarsCore.getDefaultSettings()
  }

  onSettingsUpdated(callback: Listener<SettingsUpdatedEvent>) {
    this.onSettingsUpdatedEvent.addListener(callback)
  }

  offSettingsUpdated(callback: Listener<SettingsUpdatedEvent>) {
    this.onSettingsUpdatedEvent.removeListener(callback)
  }

  #sendDebugModeToggleEvent() {
    const event = new DebugModeToggleEvent(this.debugModeEnabled)
    this.onDebugModeToggleEvent.fire(event)
  }

  #getRegionForRendering() {
    const centre = this.player.getPosition()

    const region = []

    for (let y=-VISIBLE_PIXEL_RADIUS;y<VISIBLE_PIXEL_RADIUS;y++) {
      const row = []
      for (let x=-VISIBLE_PIXEL_RADIUS;x<VISIBLE_PIXEL_RADIUS;x++) {
        row.push(this.world.getPixel(Math.floor(centre[0] + x), Math.floor(centre[1] + y)).typeId)
      }
      region.push(row)
    }

    return region
  }

  #update() {
    if (!this.running)
      return

    const now = Date.now()
    const deltaTime = now - this.lastUpdate
    this.lastUpdate = now

    const renderers: NonPixelRenderer[] = [this.player, this.buildingHandler]

    if (this.inDebugMode())
      renderers.push(this.debugRenderer)

    this.renderer.render(this.#getRegionForRendering(), renderers)

    this.movementHandler.update()

    const event = new UpdateEvent(deltaTime)
    this.onUpdateEvent.fire(event)

    setTimeout(() => {
      this.#update()
    }, 0)
  }

  onUpdate(callback: Listener<UpdateEvent>) {
    this.onUpdateEvent.addListener(callback)
  }

  offUpdate(callback: Listener<UpdateEvent>) {
    this.onUpdateEvent.removeListener(callback)
  }

  getRenderer() {
    return this.renderer
  }

  getCanvas() {
    return this.canvas
  }

  getClientWorld() {
    return this.world
  }

  getControls() {
    return this.controlsHandler
  }

  getPlayer() {
    return this.player
  }

  isInMultiplayer() {
    if (this.pixelWarsGamemode) {
      return false
    }
    return true
  }

  getSingleplayerCore() {
    return this.pixelWarsGamemode?.getCore()
  }

  getConnectionHandler() {
    return this.connectionHandler
  }

  onDebugModeToggle(callback: Listener<DebugModeToggleEvent>) {
    this.onDebugModeToggleEvent.addListener(callback)
  }

  offDebugModeToggle(callback: Listener<DebugModeToggleEvent>) {
    this.onDebugModeToggleEvent.removeListener(callback)
  }

  inDebugMode() {
    return this.debugModeEnabled
  }
}
