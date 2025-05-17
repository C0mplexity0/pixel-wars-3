import { Event, EventHandler, type Listener } from "../event";
import WorldUtils from "./utils"
import packageJson from "../package.json"

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

class PixelChangeEvent extends Event {

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

export default class World {
  private world: {[coordinates: string]: WorldPixel[][]};
  private pixelTypes: PixelType[]

  private onPixelChangeEvent: EventHandler<PixelChangeEvent>
  
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

    this.onPixelChangeEvent = new EventHandler()
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
          if (compressedChunk[(16 * y) + x] === undefined) {
            console.log(compressedChunk)
            console.log((16 * y) + x)
          }
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
