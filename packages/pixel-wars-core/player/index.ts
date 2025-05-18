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

export class PositionChangeEvent extends Event {
  private newPos: number[]

  constructor(newPos: number[]) {
    super()
    this.newPos = newPos
  }

  getNewPosition() {
    return this.newPos
  }
}

export class PixelInventoryUpdatedEvent extends Event {

  private pixelInventory: number[]
  private selectedColour: number

  constructor(pixelInventory: number[], selectedColour: number) {
    super()
    this.pixelInventory = pixelInventory
    this.selectedColour = selectedColour
  }

  getPixelInventory() {
    return this.pixelInventory
  }

  getSelectedColour() {
    return this.selectedColour
  }
}

export default class Player {
  private core: PixelWarsCore

  protected position: number[]
  protected colourId: number
  private pixelInventory: number[]
  private selectedColour: number

  private world: World

  private onWorldChangeEvent: EventHandler<WorldChangeEvent>
  private onPixelInventoryUpdatedEvent: EventHandler<PixelInventoryUpdatedEvent>
  private onPositionChangeEvent: EventHandler<PositionChangeEvent>

  constructor(core: PixelWarsCore) {
    this.core = core

    this.position = [0, 0]
    this.colourId = Math.floor(Math.random() * PLAYER_COLOURS.length)

    this.world = core.getDefaultWorld()

    this.onWorldChangeEvent = new EventHandler()

    this.pixelInventory = []
    this.selectedColour = 0

    this.onPixelInventoryUpdatedEvent = new EventHandler()
    this.onPositionChangeEvent = new EventHandler()
  }

  getPosition() {
    return this.position
  }

  setPosition(x: number, y: number) {
    if (this.position[0] === x && this.position[1] === y)
      return

    this.position = [x, y]
    this.onPositionChangeEvent.fire(new PositionChangeEvent(this.position))
  }

  setWorld(world: World) {
    if (!world) {
      this.core.removePlayer(this)
      return
    }

    this.world = world
   
    this.setPosition(0, 0)

    const event = new WorldChangeEvent(world)
    this.onWorldChangeEvent.fire(event)    
  }

  onPositionChange(callback: Listener<PositionChangeEvent>) {
    this.onPositionChangeEvent.addListener(callback)
  }

  offPositionChange(callback: Listener<PositionChangeEvent>) {
    this.onPositionChangeEvent.removeListener(callback)
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

  getPixelInventory() {
    return this.pixelInventory
  }

  setPixelInventory(pixelInventory: number[]) {
    if (this.selectedColour >= pixelInventory.length)
      this.selectedColour = pixelInventory.length-1

    this.pixelInventory = pixelInventory
    this.onPixelInventoryUpdatedEvent.fire(new PixelInventoryUpdatedEvent(pixelInventory, this.selectedColour))
  }

  onPixelInventoryUpdated(callback: Listener<PixelInventoryUpdatedEvent>) {
    this.onPixelInventoryUpdatedEvent.addListener(callback)
  }

  offPixelInventoryUpdated(callback: Listener<PixelInventoryUpdatedEvent>) {
    this.onPixelInventoryUpdatedEvent.removeListener(callback)
  }

  getSelectedColour() {
    return this.selectedColour
  }

  setSelectedColour(newColour: number) {
    this.selectedColour = newColour
    const event = new PixelInventoryUpdatedEvent(this.pixelInventory, this.selectedColour)
    this.onPixelInventoryUpdatedEvent.fire(event)
  }

  getColourId() {
    return this.colourId
  }
}
