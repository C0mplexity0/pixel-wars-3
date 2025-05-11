import type PixelWarsCore from ".."
import PixelWarsEvent from "../event"
import World from "../world"

export const PLAYER_COLOURS = [
  "#ff0000",
  "#00ff00",
  "#0000ff"
]

export default class Player {
  protected position: number[]
  protected colourId: number
  private colourInventory: number[]
  private selectedColour: number

  private world: World

  private onWorldChangeEvent: PixelWarsEvent
  private onColourInventoryUpdatedEvent: PixelWarsEvent

  constructor(core: PixelWarsCore) {
    this.position = [0, 0]
    this.colourId = Math.floor(Math.random() * PLAYER_COLOURS.length)

    this.world = core.getDefaultWorld()

    this.onWorldChangeEvent = new PixelWarsEvent()

    this.colourInventory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    this.selectedColour = 0

    this.onColourInventoryUpdatedEvent = new PixelWarsEvent()
  }

  getPosition() {
    return this.position
  }

  setPosition(x: number, y: number) {
    this.position = [x, y]
  }

  setWorld(world: World) {
    this.world = world

    this.onWorldChangeEvent.fire(world)    
  }

  onWorldChange(callback: (newWorld: World) => void) {
    this.onWorldChangeEvent.addListener(callback)
  }

  offWorldChange(callback: (newWorld: World) => void) {
    this.onWorldChangeEvent.removeListener(callback)
  }

  getWorld() {
    return this.world
  }

  getColourInventory() {
    return this.colourInventory
  }

  onColourInventoryUpdated(callback: (colourInventory: number[], selectedColour: number) => void) {
    this.onColourInventoryUpdatedEvent.addListener(callback)
  }

  offColourInventoryUpdated(callback: (colourInventory: number[], selectedColour: number) => void) {
    this.onColourInventoryUpdatedEvent.removeListener(callback)
  }

  getSelectedColour() {
    return this.selectedColour
  }

  setSelectedColour(newColour: number) {
    this.selectedColour = newColour
    this.onColourInventoryUpdatedEvent.fire(this.colourInventory, this.selectedColour)
  }

  getColourId() {
    return this.colourId
  }
}
