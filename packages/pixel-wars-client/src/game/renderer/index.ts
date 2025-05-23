import type { WorldPixel } from "pixel-wars-core/world";
import type PixelWarsClient from "..";

export const VISIBLE_PIXEL_RADIUS = 25

export interface RendererPixelInfo {
  pixel: WorldPixel,
  position: number[]
}

export default class Renderer {
  private client: PixelWarsClient
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(client: PixelWarsClient) {
    this.client = client
    this.canvas = client.getCanvas()
    const ctx = this.canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Could not get canvas context 2d")
    }

    this.ctx = ctx
    ctx.imageSmoothingEnabled = false
  }

  getCanvas() {
    return this.canvas
  }

  getContext() {
    return this.ctx
  }

  #updateCanvasSize() {
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
  }

  #getScale(pixels: RendererPixelInfo[][]) {
    const rows = pixels.length - 2
    const columns = pixels[0].length - 2

    return Math.ceil(Math.max(this.canvas.height / rows, this.canvas.width / columns))
  }

  #renderAnimatedPixelTexture(x: number, y: number, scale: number, id: number) {
    const pixelTypes = this.client.getClientWorld().getPixelTypes()
    const pixelType = pixelTypes[id]

    const canvasPos = this.getCanvasPosFromPixelPos(x, y, scale)

    if (!pixelType.animatedTexture)
      return

    let totalTime = 0
    const frames = pixelType.animatedTexture.frames

    for (let i=0;i<frames.length;i++)
      totalTime += frames[i].time

    const time = Date.now() % totalTime
    let timeLeft = time
    let frameId = 0

    for (let i=0;i<frames.length;i++) {
      timeLeft -= frames[i].time

      if (timeLeft <= 0) {
        frameId = i
        break
      }
    }

    const img = this.client.getClientWorld().loadTexture(pixelType.animatedTexture.frames[frameId].texture)

    this.ctx.drawImage(img, canvasPos[0] - Math.floor(scale/2), canvasPos[1] - Math.floor(scale/2), scale, scale)
  }

  #renderPixel(x: number, y: number, scale: number, id: number) {
    const pixelTypes = this.client.getClientWorld().getPixelTypes()
    const pixelType = pixelTypes[id]

    const canvasPos = this.getCanvasPosFromPixelPos(x, y, scale)

    if (pixelType.animatedTexture) {
      this.#renderAnimatedPixelTexture(x, y, scale, id)
    } else if (pixelType.staticTexture) {
      const img = this.client.getClientWorld().loadTexture(pixelType.staticTexture)

      this.ctx.drawImage(img, canvasPos[0] - Math.floor(scale/2), canvasPos[1] - Math.floor(scale/2), scale, scale)
    } else {
      const colour = pixelType.colour

      if (!colour || colour == "#ffffff") {
        return
      }

      this.ctx.fillStyle = colour
      this.ctx.fillRect(canvasPos[0] - Math.floor(scale/2), canvasPos[1] - Math.floor(scale/2), scale, scale)
    }
  }

  #renderPixels(pixels: RendererPixelInfo[][]) {
    const scale = this.#getScale(pixels)
    for (let y=0;y<pixels.length;y++) {
      for (let x=0;x<pixels[y].length;x++) {
        this.#renderPixel(pixels[y][x].position[0], pixels[y][x].position[1], scale, pixels[y][x].pixel.typeId)
      }
    }
  }

  getCanvasPosFromPixelPos(x: number, y: number, scale: number) {
    const [playerX, playerY] = this.client.getPlayer().getPosition()

    const canvasX = ((x - playerX) * scale) + this.canvas.width / 2
    const canvasY = ((y - playerY) * scale) + this.canvas.height / 2

    return [Math.floor(canvasX), Math.floor(canvasY)]
  }

  getCanvasCentre() {
    const x = this.canvas.width / 2
    const y = this.canvas.height /2

    return [x, y]
  }

  render(pixels: RendererPixelInfo[][], extraRenderers: NonPixelRenderer[]) {
    this.#updateCanvasSize()
    this.ctx.imageSmoothingEnabled = false

    this.#renderPixels(pixels)

    const scale = this.#getScale(pixels)

    for (let i=0;i<extraRenderers.length;i++) {
      extraRenderers[i].render(this, scale)
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export interface NonPixelRenderer {
  render: (renderer: Renderer, scale: number) => void
}
