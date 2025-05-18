import { Event, EventHandler, type Listener } from "../event";
import WorldUtils from "./utils"
import packageJson from "../package.json"

export const CHUNK_SIZE = 16

export interface WorldPixel {
  typeId: number,
  playerCanWalk?: boolean,
  buildingDisabled?: boolean,
  animationTime?: number
}

export interface PixelType {
  colour: string,
  staticTexture?: string,
  animatedTexture?: {
    frames: {texture: string, time: number}[]
  }
}

export interface PixelWarsWorldFile {
  info: {
    validPixelWarsWorldFile: true,
    version: string,
    chunkSize: number,
    pixelTypes: PixelType[],
    pixels: WorldPixel[]
  },
  chunks: {
    [chunkId: string]: number[]
  }
}

export class PixelChangeEvent extends Event {

  private pos: number[]
  private pixel: WorldPixel

  constructor(x: number, y: number, pixel: WorldPixel) {
    super()
    this.pos = [x, y]
    this.pixel = pixel
  }

  getPosition() {
    return this.pos
  }

  getWorldPixel() {
    return this.pixel
  }
}

export class VisiblePixelRadiusChangeEvent extends Event {
  private visiblePixelRadius: number

  constructor(visiblePixelRadius: number) {
    super()
    this.visiblePixelRadius = visiblePixelRadius
  }

  getVisiblePixelRadius() {
    return this.visiblePixelRadius
  }
}

export default class World {
  private world: {[coordinates: string]: WorldPixel[][]};
  private generator: (x: number, y: number) => WorldPixel[][]
  private pixelTypes: PixelType[]

  private visiblePixelRadius: number

  private onPixelChangeEvent: EventHandler<PixelChangeEvent>
  private onVisiblePixelRadiusChangeEvent: EventHandler<VisiblePixelRadiusChangeEvent>
  
  constructor() {
    this.world = {}
    this.pixelTypes = [
      {
        colour: "#ffffff"
      }
    ]

    this.visiblePixelRadius = 25

    this.onPixelChangeEvent = new EventHandler()
    this.onVisiblePixelRadiusChangeEvent = new EventHandler()

    this.generator = (x: number, y: number) => {
      const chunk: WorldPixel[][] = WorldUtils.createBlankChunk()

      if (x === 0 && y === 0) {
        chunk[0][0] = {
          typeId: 0,
          playerCanWalk: true
        }
      }

      return chunk
    }
  }

  setGenerator(callback: (x: number, y: number) => WorldPixel[][]) {
    this.generator = callback
  }

  #generateNewChunk(x: number, y: number) {
    const chunkId = WorldUtils.getChunkId(x, y)

    const chunk = this.generator(x, y)

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

  setChunk(x: number, y: number, chunk: WorldPixel[][]) {
    const chunkId = WorldUtils.getChunkId(x, y)
    this.world[chunkId] = chunk
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

    const event = new PixelChangeEvent(x, y, pixel)
    this.onPixelChangeEvent.fire(event)
  }

  getPixelTypes() {
    return this.pixelTypes
  }

  setPixelTypes(pixelTypes: PixelType[]) {
    this.pixelTypes = pixelTypes
  }

  onPixelChange(callback: Listener<PixelChangeEvent>) {
    this.onPixelChangeEvent.addListener(callback)
  }

  offPixelChange(callback: Listener<PixelChangeEvent>) {
    this.onPixelChangeEvent.removeListener(callback)
  }

  getVisiblePixelRadius() {
    return this.visiblePixelRadius
  }

  setVisiblePixelRadius(visiblePixelRadius: number) {
    this.visiblePixelRadius = visiblePixelRadius
    this.onVisiblePixelRadiusChangeEvent.fire(new VisiblePixelRadiusChangeEvent(visiblePixelRadius))
  }

  onVisiblePixelRadiusChange(callback: Listener<VisiblePixelRadiusChangeEvent>) {
    this.onVisiblePixelRadiusChangeEvent.addListener(callback)
  }

  offVisiblePixelRadiusChange(callback: Listener<VisiblePixelRadiusChangeEvent>) {
    this.onVisiblePixelRadiusChangeEvent.removeListener(callback)
  }

  getFileContent() {
    const pixels: {[x: string]: any}[] = []

    const getMatchingPixel = (pixel: {[x: string]: any}) => {
      for (let i=0;i<pixels.length;i++) {
        const checkingPixel = pixels[i]

        const checkingPixelProperties = Object.keys(checkingPixel)
        const pixelProperties = Object.keys(pixel)

        if (checkingPixelProperties.length !== pixelProperties.length)
          continue

        let propertiesMatch = true

        for (let j=0;j<pixelProperties.length;j++) {
          if (!checkingPixelProperties.includes(pixelProperties[j])) {
            propertiesMatch = false
            continue
          }

          checkingPixelProperties.splice(checkingPixelProperties.indexOf(pixelProperties[j]), 1)
        }

        if (!propertiesMatch)
          continue

        for (const property in pixel) {
          if (pixel[property] !== checkingPixel[property]) {
            propertiesMatch = false
            continue
          }
        }

        if (propertiesMatch)
          return i
      }
    }

    const chunks: {[id: string]: number[]} = {}
    
    for (const chunkId in this.world) {
      const chunk = this.world[chunkId]
      const formattedChunk: number[] = []

      for (let y=0;y<chunk.length;y++) {
        for (let x=0;x<chunk[y].length;x++) {
          const pixel = chunk[y][x]
          let matchingPixel = getMatchingPixel(pixel)
          if (matchingPixel === undefined) {
            matchingPixel = pixels.length
            pixels.push(pixel)
          }

          formattedChunk.push(matchingPixel)
        }
      }

      chunks[chunkId] = formattedChunk
    }

    const info = {
      validPixelWarsWorldFile: true,
      version: packageJson.version,
      chunkSize: CHUNK_SIZE,
      pixelTypes: this.getPixelTypes(),
      pixels
    }

    return {
      info,
      chunks
    }
  }

  static fromFileContent(json: PixelWarsWorldFile) {
    const world = new World()

    const info = json.info
    const chunks = json.chunks
    const pixels = info.pixels

    for (const chunkId in chunks) {
      const compressedChunk: number[] = chunks[chunkId]
      const chunk: WorldPixel[][] = []

      for (let y=0;y<info.chunkSize;y++) {
        const row: WorldPixel[] = []
        for (let x=0;x<info.chunkSize;x++) {
          row.push(pixels[compressedChunk[(16 * y) + x]])
        }
        chunk.push(row)
      }

      const [x, y] = WorldUtils.getPosFromChunkId(chunkId)
      world.setChunk(x, y, chunk)
    }

    world.setPixelTypes(info.pixelTypes)

    return world
  }

  static validateFileContent(json: any) {
    if (!(json instanceof Object))
      return false


    if (!json.info || !json.chunks)
      return false

    const info = json.info

    if (!(info instanceof Object))
      return false

    if (!info.chunkSize || !info.pixelTypes || !info.pixels || !info.validPixelWarsWorldFile || !info.version)
      return false

    if (info.version != packageJson.version)
      return false

    const chunks = json.chunks

    if (!(chunks instanceof Object))
      return false

    return true
  }
}
