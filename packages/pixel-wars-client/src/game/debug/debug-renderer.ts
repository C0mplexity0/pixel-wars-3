import WorldUtils from "pixel-wars-core/world/utils";
import type PixelWarsClient from "..";
import type Renderer from "../renderer";
import type { NonPixelRenderer } from "../renderer";
import { CHUNK_SIZE } from "pixel-wars-core/world";

export default class DebugRenderer implements NonPixelRenderer {

  private client: PixelWarsClient

  constructor(client: PixelWarsClient) {
    this.client = client
  }

  render(renderer: Renderer, scale: number) {
    const playerPos = this.client.getPlayer().getPosition()
    const chunkCoordinates = WorldUtils.getChunkFromPixelPos(playerPos[0], playerPos[1])
    const chunkPixelPos = [chunkCoordinates[0] * CHUNK_SIZE, chunkCoordinates[1] * CHUNK_SIZE]

    const rectPos = renderer.getCanvasPosFromPixelPos(chunkPixelPos[0] - playerPos[0], chunkPixelPos[1] - playerPos[1], scale)

    const ctx = renderer.getContext()
    ctx.strokeStyle = "#db7b27"
    ctx.lineWidth = 2
    ctx.beginPath()
    const offset = -Math.floor(scale/2)
    ctx.rect(rectPos[0] + offset, rectPos[1] + offset, scale * CHUNK_SIZE, scale * CHUNK_SIZE)
    ctx.stroke()
  }
}
