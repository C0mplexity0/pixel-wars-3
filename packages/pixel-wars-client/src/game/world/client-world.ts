import type { PixelType, WorldPixel } from "pixel-wars-core/world";
import WorldUtils from "pixel-wars-core/world/utils";
import type PixelWarsClient from "..";

export default class ClientWorld {
  private world: {[coordinates: string]: WorldPixel[][]}
  private client: PixelWarsClient
  private textureCache: {[url: string]: HTMLImageElement}

  constructor(client: PixelWarsClient) {
    this.world = {}
    this.client = client
    this.textureCache = {}
  }

  #loadChunk(x: number, y: number) {
    const chunkId = WorldUtils.getChunkId(x, y)

    if (this.world[chunkId]) {
      return
    }

    const singleplayerCore = this.client.getSingleplayerCore()

    if (singleplayerCore) {
      this.world[chunkId] = singleplayerCore.getPlayers()[0].getWorld().getChunk(x, y)
    }
  }

  getChunk(x: number, y: number) {
    const chunkId = WorldUtils.getChunkId(x, y)
    const chunk = this.world[chunkId]

    if (!chunk) {
      this.#loadChunk(x, y)
      return WorldUtils.createBlankChunk()
    }

    return chunk
  }

  getPixel(x: number, y: number) {
    const [chunkX, chunkY] = WorldUtils.getChunkFromPixelPos(x, y)
    const [xInChunk, yInChunk] = WorldUtils.getPosInChunkFromPixelPos(x, y)

    return this.getChunk(chunkX, chunkY)[yInChunk][xInChunk]
  }

  setPixel(x: number, y: number, pixel: WorldPixel) {
    const singleplayerCore = this.client.getSingleplayerCore()

    if (singleplayerCore) {
      singleplayerCore.getPlayers()[0].getWorld().setPixel(x, y, pixel)
    }
  }

  getPixelTypes(): PixelType[] {
    const singleplayerCore = this.client.getSingleplayerCore()

    if (singleplayerCore) {
      return singleplayerCore.getPlayers()[0].getWorld().getPixelTypes()
    }

    return [
      {
        colour: "#ffffff"
      }
    ]
  }

  loadTexture(texture: string) {
    if (this.textureCache[texture]) {
      return this.textureCache[texture]
    }

    const img = new Image()
    img.src = texture
    this.textureCache[texture] = img
    return img
  }
}
