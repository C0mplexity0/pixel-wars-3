import type LocalPlayer from "./local-player";
import type PixelWarsGame from "..";

export default class MovementHandler {

  private game: PixelWarsGame
  private player: LocalPlayer
  private lastMovement: number

  constructor(game: PixelWarsGame, player: LocalPlayer) {
    this.game = game
    this.player = player
    this.lastMovement = Date.now()
  }

  getPlayer() {
    return this.player
  }

  canWalkOnPixel(x: number, y: number) {
    const pixel = this.game.getClientWorld().getPixel(x, y)
    return pixel.playerCanWalk
  }

  update() {
    if (Date.now() - this.lastMovement < 80) {
      return
    }

    let xChange = 0
    let yChange = 0

    const controlsHandler = this.game.getControls()

    if (controlsHandler.keyTypePressed("BUILD_MODE")) {
      return
    }

    if (controlsHandler.keyTypePressed("UP")) {
      yChange--
    }
    if (controlsHandler.keyTypePressed("DOWN")) {
      yChange++
    }
    if (controlsHandler.keyTypePressed("LEFT")) {
      xChange--
    }
    if (controlsHandler.keyTypePressed("RIGHT")) {
      xChange++
    }

    const oldPos = this.player.getPosition()
    const newPos = [oldPos[0] + xChange, oldPos[1] + yChange]

    const newPosOmitXChange = [oldPos[0], oldPos[1] + yChange]
      const newPosOmitYChange = [oldPos[0] + xChange, oldPos[1]]

      const canWalkWhenOmitXChange = this.canWalkOnPixel(newPosOmitXChange[0], newPosOmitXChange[1])
      const canWalkWhenOmitYChange = this.canWalkOnPixel(newPosOmitYChange[0], newPosOmitYChange[1])

    if (this.canWalkOnPixel(newPos[0], newPos[1]) && (canWalkWhenOmitXChange || canWalkWhenOmitYChange)) {
      this.player.setPosition(newPos[0], newPos[1])
      this.lastMovement = Date.now()
    } else {
      if (canWalkWhenOmitYChange) {
        this.player.setPosition(newPosOmitYChange[0], newPosOmitYChange[1])
        this.lastMovement = Date.now()
      } else if (canWalkWhenOmitXChange) {
        this.player.setPosition(newPosOmitXChange[0], newPosOmitXChange[1])
        this.lastMovement = Date.now()
      }
    }
  }
}