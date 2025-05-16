import type PixelWarsCore from ".."
import { Event, EventHandler, type Listener } from "../event"
import World from "../world"

export const PLAYER_COLOURS = [
  "#ff0000",
  "#00ff00",
  "#0000ff"
]

export class WorldChangeEvent extends Event {
  private world: World

  constructor(world: World) {
    super()
    this.world = world
  }

  getWorld() {
    return this.world
  }
}

export class ColourInventoryUpdatedEvent extends Event {

  private colourInventory: number[]
  private selectedColour: number

  constructor(colourInventory: number[], selectedColour: number) {
    super()
    this.colourInventory = colourInventory
    this.selectedColour = selectedColour
  }

  getColourInventory() {
    return this.colourInventory
  }

  getSelectedColour() {
    return this.selectedColour
  }
}

export default class Player {
  protected position: number[]
  protected colourId: number
  private colourInventory: number[]
  private selectedColour: number

  private world: World

  private onWorldChangeEvent: EventHandler<WorldChangeEvent>
  private onColourInventoryUpdatedEvent: EventHandler<ColourInventoryUpdatedEvent>

  constructor(core: PixelWarsCore) {
    this.position = [0, 0]
    this.colourId = Math.floor(Math.random() * PLAYER_COLOURS.length)

    this.world = core.getDefaultWorld()

    this.onWorldChangeEvent = new EventHandler()

    this.colourInventory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    this.selectedColour = 0

    this.onColourInventoryUpdatedEvent = new EventHandler()
  }

  getPosition() {
    return this.position
  }

  setPosition(x: number, y: number) {
    this.position = [x, y]
  }

  setWorld(world: World) {
    this.world = world

    const event = new WorldChangeEvent(world)
    this.onWorldChangeEvent.fire(event)    
  }

  onWorldChange(callback: Listener<WorldChangeEvent>) {
    this.onWorldChangeEvent.addListener(callback)
  }

  offWorldChange(callback: Listener<WorldChangeEvent>) {
    this.onWorldChangeEvent.removeListener(callback)
  }

  getWorld() {
    return this.world
  }

  getColourInventory() {
    return this.colourInventory
  }

  onColourInventoryUpdated(callback: Listener<ColourInventoryUpdatedEvent>) {
    this.onColourInventoryUpdatedEvent.addListener(callback)
  }

  offColourInventoryUpdated(callback: Listener<ColourInventoryUpdatedEvent>) {
    this.onColourInventoryUpdatedEvent.removeListener(callback)
  }

  getSelectedColour() {
    return this.selectedColour
  }

  setSelectedColour(newColour: number) {
    this.selectedColour = newColour
    const event = new ColourInventoryUpdatedEvent(this.colourInventory, this.selectedColour)
    this.onColourInventoryUpdatedEvent.fire(event)
  }

  getColourId() {
    return this.colourId
  }
}
