import World, { CHUNK_SIZE, type WorldPixel } from "."
import type PixelWarsCore from ".."

export default class WorldUtils {
  static getChunkFromPixelPos(x: number, y: number) {
    const chunkX = Math.floor(x / CHUNK_SIZE)
    const chunkY = Math.floor(y / CHUNK_SIZE)

    return [chunkX, chunkY]
  }

  static getPosInChunkFromPixelPos(x: number, y: number) {
    let xInChunk = x % CHUNK_SIZE
    let yInChunk = y % CHUNK_SIZE

    if (xInChunk < 0) {
      xInChunk = CHUNK_SIZE + xInChunk
    }

    if (yInChunk < 0) {
      yInChunk = CHUNK_SIZE + yInChunk
    }

    return [xInChunk, yInChunk]
  }

  static getChunkId(x: number, y: number) {
    return `${x},${y}`
  }

  static getPosFromChunkId(id: string) {
    const parts = id.split(",")

    return [parseInt(parts[0]), parseInt(parts[1])]
  }

  static createBlankChunk() {
    const chunk: WorldPixel[][] = []
    
    for (let y=0;y<CHUNK_SIZE;y++) {
      const row = []
      for (let x=0;x<CHUNK_SIZE;x++) {
        row.push({
          typeId: 0,
          playerCanWalk: true
        })
      }
      chunk.push(row)
    }

    return chunk
  }

  static importFile(core: PixelWarsCore, file: string) {
    try {
      const json = JSON.parse(file)
      if (!World.validateFileContent(json))
        return

      core.addWorld(World.fromFileContent(json))
      core.removeWorld(core.getDefaultWorld())
    } catch(err) {
      console.warn(err)
    }
  }
}
