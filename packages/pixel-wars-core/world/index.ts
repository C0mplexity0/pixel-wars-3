import PixelWarsEvent from "../event";
import WorldUtils from "./utils"

export const CHUNK_SIZE = 16

export interface WorldPixel {
  typeId: number,
  playerCanWalk?: boolean,
  buildingDisabled?: boolean,
}

export interface PixelType {
  colour: string,
  texture?: string
}

export default class World {
  private world: {[coordinates: string]: WorldPixel[][]};
  private pixelTypes: PixelType[]

  private onPixelChangeEvent: PixelWarsEvent<Parameters<(x: number, y: number, pixel: WorldPixel) => void>>
  
  constructor() {
    this.world = {}
    this.pixelTypes = [
      {
        colour: "#ffffff"
      },
      {
        colour: "#000000"
      },
      {
        colour: "#474747"
      },
      {
        colour: "#878787"
      },
      {
        colour: "#BABABA"
      },
      {
        colour: "#E53935"
      },
      {
        colour: "#B71C1C"
      },
      {
        colour: "#F57F17"
      },
      {
        colour: "#5A3D23"
      },
      {
        colour: "#FFEB3B"
      },
      {
        colour: "#95DE16"
      },
      {
        colour: "#37DE16"
      },
      {
        colour: "#1DA811"
      },
      {
        colour: "#33691E"
      },
      {
        colour: "#18C7B8"
      },
      {
        colour: "#18A7C7"
      },
      {
        colour: "#0D47A1"
      },
      {
        colour: "#6C18C7"
      },
      {
        colour: "#B218C7"
      },
      {
        colour: "#C718A1"
      },
      {
        colour: "#F06292"
      }
    ]

    this.onPixelChangeEvent = new PixelWarsEvent()
  }

  #generateNewChunk(x: number, y: number) {
    const chunkId = WorldUtils.getChunkId(x, y)

    const chunk: WorldPixel[][] = WorldUtils.createBlankChunk()

    if (x === 0 && y === 0) {
      chunk[0][0] = {
        typeId: 0,
        playerCanWalk: true
      }
    }

    this.world[chunkId] = chunk

    return chunk
  }

  getChunk(x: number, y: number) {
    const chunkId = WorldUtils.getChunkId(x, y)
    const chunk = this.world[chunkId]

    if (!chunk) {
      return this.#generateNewChunk(x, y)
    }

    return chunk
  }

  getPixel(x: number, y: number) {
    const [chunkX, chunkY] = WorldUtils.getChunkFromPixelPos(x, y)
    const [xInChunk, yInChunk] = WorldUtils.getPosInChunkFromPixelPos(x, y)

    return this.getChunk(chunkX, chunkY)[yInChunk][xInChunk]
  }

  setPixel(x: number, y: number, pixel: WorldPixel) {
    const [chunkX, chunkY] = WorldUtils.getChunkFromPixelPos(x, y)
    const [xInChunk, yInChunk] = WorldUtils.getPosInChunkFromPixelPos(x, y)

    const chunkId = WorldUtils.getChunkId(chunkX, chunkY)

    if (!this.world[chunkId])
      this.world[chunkId] = WorldUtils.createBlankChunk()

    this.world[chunkId][yInChunk][xInChunk] = pixel

    this.onPixelChangeEvent.fire(x, y, pixel)
  }

  getPixelTypes() {
    return this.pixelTypes
  }

  onPixelChange(callback: (x: number, y: number, pixel: WorldPixel) => void) {
    this.onPixelChangeEvent.addListener(callback)
  }

  offPixelChange(callback: (x: number, y: number, pixel: WorldPixel) => void) {
    this.onPixelChangeEvent.removeListener(callback)
  }
}
