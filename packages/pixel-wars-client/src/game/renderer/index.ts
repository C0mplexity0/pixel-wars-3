import type PixelWarsClient from "..";

export const VISIBLE_PIXEL_RADIUS = 25

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

  #getScale(pixels: number[][]) {
    const rows = pixels.length - 1
    const columns = pixels[0].length - 1

    return Math.ceil(Math.max(this.canvas.height / rows, this.canvas.width / columns))
  }

  #renderPixel(x: number, y: number, scale: number, id: number) {
    const pixelTypes = this.client.getClientWorld().getPixelTypes()
    const pixelType = pixelTypes[id]

    const canvasPos = this.getCanvasPosFromPixelPos(x, y, scale)

    if (pixelType.texture) {
      const img = this.client.getClientWorld().loadTexture(pixelType.texture)
      img.src = pixelType.texture

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

  #renderPixels(pixels: number[][]) {
    const rows = pixels.length
    const columns = pixels[0].length

    const scale = this.#getScale(pixels)
    for (let y=0;y<pixels.length;y++) {
      for (let x=0;x<pixels[y].length;x++) {
        this.#renderPixel(x - (columns / 2), y - (rows / 2), scale, pixels[y][x])
      }
    }
  }

  getCanvasPosFromPixelPos(x: number, y: number, scale: number) {
    const canvasX = (x * scale) + Math.floor(this.canvas.width / 2)
    const canvasY = (y * scale) + Math.floor(this.canvas.height / 2)

    return [canvasX, canvasY]
  }

  getCanvasCentre() {
    const x = this.canvas.width / 2
    const y = this.canvas.height /2

    return [x, y]
  }

  render(pixels: number[][], extraRenderers: NonPixelRenderer[]) {
    this.#updateCanvasSize()

    this.#renderPixels(pixels)

    const scale = this.#getScale(pixels)

    for (let i=0;i<extraRenderers.length;i++) {
      extraRenderers[i].render(this, scale)
    }
  }
}

export interface NonPixelRenderer {
  render: (renderer: Renderer, scale: number) => void
}
