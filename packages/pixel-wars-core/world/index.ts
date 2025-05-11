import WorldUtils from "./utils"

export const PIXEL_COLOURS = [
  "#ffffff",
  "#000000",
  "#ff0000",
  "#00ff00",
  "#0000ff"
]

export const CHUNK_SIZE = 16

export interface WorldPixel {
  colour: number,
  playerCanWalk?: boolean,
  buildingDisabled?: boolean,
}

export default class World {
  private world: {[coordinates: string]: WorldPixel[][]};
  
  constructor() {
    this.world = {}
  }

  #generateNewChunk(x: number, y: number) {
    const chunkId = WorldUtils.getChunkId(x, y)

    const chunk: WorldPixel[][] = WorldUtils.createBlankChunk()

    if (x === 0 && y === 0) {
      chunk[0][0] = {
        colour: 0,
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

    this.world[WorldUtils.getChunkId(chunkX, chunkY)][yInChunk][xInChunk] = pixel
  }
}
