import { Event, EventHandler, type Listener } from "pixel-wars-core/event";
import type PixelWarsClient from "..";
import type Renderer from "../renderer";
import type { NonPixelRenderer } from "../renderer";
import { PLAYER_COLOURS } from "pixel-wars-core/player";

export class LocalPixelInventoryUpdatedEvent extends Event {

  private pixelInventory: number[]
  private selectedPixel: number

  constructor(pixelInventory: number[], selectedPixel: number) {
    super()
    this.pixelInventory = pixelInventory
    this.selectedPixel = selectedPixel
  }

  getPixelInventory() {
    return this.pixelInventory
  }

  getSelectedPixel() {
    return this.selectedPixel
  }
}

export default class LocalPlayer implements NonPixelRenderer {
  private client: PixelWarsClient

  private colourId: number

  private position: number[]

  private pixelInventory: number[]
  private selectedPixel: number

  private onPixelInventoryUpdatedEvent: EventHandler<LocalPixelInventoryUpdatedEvent>

  constructor(client: PixelWarsClient) {
    this.colourId = 0
    
    this.position = [0, 0]

    this.pixelInventory = []
    this.selectedPixel = 0

    this.onPixelInventoryUpdatedEvent = new EventHandler()

    this.client = client
    
    const singleplayerCore = client.getSingleplayerCore()
    if (singleplayerCore) {
      const player = singleplayerCore.getPlayers()[0]
      this.colourId = player.getColourId()
      this.position = player.getPosition()
      this.pixelInventory = player.getPixelInventory()

      player.onWorldChange(() => {
        this.client.getClientWorld().reset()
      })

      player.onPositionChange((event) => {
        const [x, y] = event.getNewPosition()
        this.setPosition(x, y)
      })

      player.onPixelInventoryUpdated((event) => {
        this.setPixelInventory(event.getPixelInventory())
      })
    }

    window.addEventListener("keyup", (event) => {
      const id = parseInt(event.key)
      
      if (id && this.pixelInventory.length >= id) {
        this.setSelectedPixel(id-1)
      }
    })
  }

  #emitUpdateEvent() {
    const event = new LocalPixelInventoryUpdatedEvent(this.pixelInventory, this.selectedPixel)
    this.onPixelInventoryUpdatedEvent.fire(event)
  }

  setSelectedPixel(colour: number) {
    this.selectedPixel = colour
    this.#emitUpdateEvent()
  }

  getSelectedPixel() {
    return this.selectedPixel
  }

  getPixelInventory() {
    return this.pixelInventory
  }

  setPixelInventory(pixelInventory: number[]) {
    this.pixelInventory = pixelInventory
    this.#emitUpdateEvent()
  }

  getPosition() {
    return this.position
  }

  setPosition(x: number, y: number) {
    this.position = [x, y]

    const singleplayerCore = this.client.getSingleplayerCore()
    if (singleplayerCore) {
      singleplayerCore.getPlayers()[0].setPosition(x, y)
    }
  }

  onPixelInventoryUpdated(callback: Listener<LocalPixelInventoryUpdatedEvent>) {
    this.onPixelInventoryUpdatedEvent.addListener(callback)
  }

  offPixelInventoryUpdated(callback: Listener<LocalPixelInventoryUpdatedEvent>) {
    this.onPixelInventoryUpdatedEvent.removeListener(callback)
  }

  render(renderer: Renderer, scale: number) {
    const pos = this.getPosition()
    const [canvasX, canvasY] = renderer.getCanvasPosFromPixelPos(pos[0], pos[1], scale)

    const size = scale * 0.6

    const ctx = renderer.getContext()
    ctx.fillStyle = PLAYER_COLOURS[this.colourId]
    ctx.fillRect(canvasX - (size/2), canvasY - (size/2), size, size)
  }
}
