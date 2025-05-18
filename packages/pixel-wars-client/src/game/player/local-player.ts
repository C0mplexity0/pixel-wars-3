import { EventHandler, type Listener } from "pixel-wars-core/event";
import type PixelWarsClient from "..";
import type Renderer from "../renderer";
import type { NonPixelRenderer } from "../renderer";
import { PixelInventoryUpdatedEvent, PLAYER_COLOURS } from "pixel-wars-core/player";

export default class LocalPlayer implements NonPixelRenderer {
  private client: PixelWarsClient

  private colourId: number

  private position: number[]

  private pixelInventory: number[]
  private selectedColour: number

  private onPixelInventoryUpdatedEvent: EventHandler<PixelInventoryUpdatedEvent>

  constructor(client: PixelWarsClient) {
    this.colourId = 0
    
    this.position = [0, 0]

    this.pixelInventory = []
    this.selectedColour = 0

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
    }

    window.addEventListener("keyup", (event) => {
      const id = parseInt(event.key)
      
      if (id && this.pixelInventory.length >= id) {
        this.setSelectedColour(id-1)
      }
    })
  }

  #emitUpdateEvent() {
    const event = new PixelInventoryUpdatedEvent(this.pixelInventory, this.selectedColour)
    this.onPixelInventoryUpdatedEvent.fire(event)
  }

  setSelectedColour(colour: number) {
    const singleplayerCore = this.client.getSingleplayerCore()
    if (singleplayerCore) {
      singleplayerCore.getPlayers()[0].setSelectedColour(colour)
      this.selectedColour = colour
      this.#emitUpdateEvent()
    }
  }

  getSelectedColour() {
    return this.selectedColour
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

  onPixelInventoryUpdated(callback: Listener<PixelInventoryUpdatedEvent>) {
    this.onPixelInventoryUpdatedEvent.addListener(callback)
  }

  offPixelInventoryUpdated(callback: Listener<PixelInventoryUpdatedEvent>) {
    this.onPixelInventoryUpdatedEvent.removeListener(callback)
  }

  render(renderer: Renderer, scale: number) {
    const size = scale * 0.6

    const x = renderer.getCanvas().width / 2
    const y = renderer.getCanvas().height / 2

    const ctx = renderer.getContext()
    ctx.fillStyle = PLAYER_COLOURS[this.colourId]
    ctx.fillRect(x - size/2, y - size/2, size, size)
  }
}
