import PixelWarsEvent from "pixel-wars-core/event"
import LocalPlayer from "./player/local-player"
import Renderer, { VISIBLE_PIXEL_RADIUS } from "./renderer"
import ClientWorld from "./world/client-world"
import type PixelWarsCore from "pixel-wars-core"
import ControlsHandler from "./player/controls"
import MovementHandler from "./player/movement"
import BuildingHandler from "./world/building"
import Player from "pixel-wars-core/player"

export default class PixelWarsClient {
  private pixelWarsCore?: PixelWarsCore

  private renderer: Renderer
  private world: ClientWorld
  private player: LocalPlayer
  private movementHandler: MovementHandler
  private controlsHandler: ControlsHandler
  private buildingHandler: BuildingHandler

  private lastUpdate: number

  private onUpdateEvent: PixelWarsEvent

  constructor(canvas: HTMLCanvasElement, pixelWarsCore?: PixelWarsCore) {
    console.info("STARTING PIXEL WARS CLIENT")

    this.pixelWarsCore = pixelWarsCore

    if (pixelWarsCore) {
      pixelWarsCore.addPlayer(new Player(pixelWarsCore))
    }

    this.renderer = new Renderer(canvas)
    this.world = new ClientWorld(this)
    this.player = new LocalPlayer(this)

    this.movementHandler = new MovementHandler(this, this.player)
    this.controlsHandler = new ControlsHandler()
    this.buildingHandler = new BuildingHandler(this)

    this.lastUpdate = Date.now()

    this.onUpdateEvent = new PixelWarsEvent()

    setTimeout(() => {
      this.#update()
    }, 1000/60)
  }

  #getRegionForRendering() {
    const centre = this.player.getPosition()

    const region = []

    for (let y=-VISIBLE_PIXEL_RADIUS;y<VISIBLE_PIXEL_RADIUS;y++) {
      const row = []
      for (let x=-VISIBLE_PIXEL_RADIUS;x<VISIBLE_PIXEL_RADIUS;x++) {
        row.push(this.world.getPixel(centre[0] + x, centre[1] + y).colour)
      }
      region.push(row)
    }

    return region
  }

  #update() {
    const now = Date.now()
    const deltaTime = now - this.lastUpdate
    this.lastUpdate = now

    this.renderer.render(this.#getRegionForRendering(), [this.player, this.buildingHandler])

    this.movementHandler.update()

    this.onUpdateEvent.fire(deltaTime)

    setTimeout(() => {
      this.#update()
    }, 1000/60)
  }

  onUpdate(callback: (deltaTime: number) => void) {
    this.onUpdateEvent.addListener(callback)
  }

  offUpdate(callback: (deltaTime: number) => void) {
    this.onUpdateEvent.removeListener(callback)
  }

  getRenderer() {
    return this.renderer
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
    if (this.pixelWarsCore) {
      return true
    }
    return false
  }

  getSingleplayerCore() {
    return this.pixelWarsCore
  }
}
