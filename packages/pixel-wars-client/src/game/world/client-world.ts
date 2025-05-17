import type { PixelType, WorldPixel } from "pixel-wars-core/world";
import WorldUtils from "pixel-wars-core/world/utils";
import type PixelWarsClient from "..";
import PacketInPlacePixel from "pixel-wars-protocol/definitions/packets/in/place-pixel";

export default class ClientWorld {
  private world: {[coordinates: string]: WorldPixel[][]}
  private client: PixelWarsClient
  private textureCache: {[url: string]: HTMLImageElement}
  private pixelTypes: PixelType[]

  constructor(client: PixelWarsClient) {
    this.world = {}
    this.client = client
    this.textureCache = {}
    this.pixelTypes = [
      {
        colour: "#ffffff"
      }
    ]
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

    singleplayerCore?.getPlayers()[0].getWorld().setPixel(x, y, pixel)

    const [chunkX, chunkY] = WorldUtils.getChunkFromPixelPos(x, y)
    const [xInChunk, yInChunk] = WorldUtils.getPosInChunkFromPixelPos(x, y)

    const chunkId = WorldUtils.getChunkId(chunkX, chunkY)

    if (!this.world[chunkId])
      this.world[chunkId] = WorldUtils.createBlankChunk()

    this.world[chunkId][yInChunk][xInChunk] = pixel
  }

  placePixel(x: number, y: number, pixel: WorldPixel) {
    const singleplayerCore = this.client.getSingleplayerCore()

    if (singleplayerCore) {
      this.setPixel(x, y, pixel)
    }

    const connectionHandler = this.client.getConnectionHandler()

    if (!connectionHandler)
      return

    const packet = new PacketInPlacePixel(connectionHandler.getSocket(), x, y, pixel)
    packet.send()
  }

  getPixelTypes(): PixelType[] {
    const singleplayerCore = this.client.getSingleplayerCore()

    if (singleplayerCore) {
      this.pixelTypes = singleplayerCore.getPlayers()[0].getWorld().getPixelTypes()
    }
    
    return this.pixelTypes
  }

  setPixelTypes(pixelTypes: PixelType[]) {
    this.pixelTypes = pixelTypes
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

  getFileContent() {
    const core = this.client.getSingleplayerCore()
    if (core)
      return core.getDefaultWorld().getFileContent()
  }

  reset() {
    this.world = {}
    this.textureCache = {}
    this.pixelTypes = [
      {
        colour: "#ffffff"
      }
    ]
  }
}
