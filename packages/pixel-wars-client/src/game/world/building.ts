import type PixelWarsGame from "..";
import type { NonPixelRenderer } from "../renderer";
import type Renderer from "../renderer";

export default class BuildingHandler implements NonPixelRenderer {
  private game: PixelWarsGame

  constructor(game: PixelWarsGame) {
    this.game = game

    game.getControls().onKeyDown((event) => {
      if (!this.game.getControls().keyTypePressed("BUILD_MODE")) {
        return
      }

      const keyType = event.getKeyType()

      let editPos

      switch (keyType) {
        case "UP":
          editPos = [0, -1]
          break;
        case "DOWN":
          editPos = [0, 1]
          break;
        case "LEFT":
          editPos = [-1, 0]
          break;
        case "RIGHT":
          editPos = [1, 0]
          break;
      }

      if (!editPos) {
        return
      }

      const playerPos = game.getPlayer().getPosition()
      const x = playerPos[0] + editPos[0]
      const y = playerPos[1] + editPos[1]

      const pixelType = game.getClientWorld().getPixel(x, y)

      if (pixelType.typeId === 0) {
        game.getClientWorld().placePixel(x, y, {
          typeId: game.getPlayer().getPixelInventory()[game.getPlayer().getSelectedColour()]
        })
      } else {
        game.getClientWorld().placePixel(x, y, {
          typeId: 0,
          playerCanWalk: true
        })
      }
    })
  }

  #renderPixelBuildableIndicator(renderer: Renderer, x: number, y: number, xOffset: number, yOffset: number, scale: number) {
    const ctx = renderer.getContext()
    const pixel = this.game.getClientWorld().getPixel(x, y)

    if (pixel.buildingDisabled) {
      return
    }

    const centre = this.game.getRenderer().getCanvasCentre()

    ctx.strokeStyle = "#333333"
    ctx.lineWidth = Math.ceil(.1 * scale)
    ctx.beginPath()
    ctx.rect(centre[0] + (xOffset * scale) - scale/2, centre[1] + (yOffset * scale) - scale/2, scale, scale)
    ctx.stroke()
  }

  render(renderer: Renderer, scale: number) {
    if (!this.game.getControls().keyTypePressed("BUILD_MODE")) {
      return
    }

    const playerPos = this.game.getPlayer().getPosition()

    this.#renderPixelBuildableIndicator(renderer, playerPos[0]-1, playerPos[1], -1, 0, scale)
    this.#renderPixelBuildableIndicator(renderer, playerPos[0]+1, playerPos[1], 1, 0, scale)
    this.#renderPixelBuildableIndicator(renderer, playerPos[0], playerPos[1]-1, 0, -1, scale)
    this.#renderPixelBuildableIndicator(renderer, playerPos[0], playerPos[1]+1, 0, 1, scale)
  }
}
