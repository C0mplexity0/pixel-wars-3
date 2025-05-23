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

  #pointTouchingPixel(x: number, y: number) {
    const pixel = this.game.getClientWorld().getPixel(x, y)
    return !pixel.playerCanWalk
  }

  #playerTouchingPixel(x: number, y: number) {
    const checkPoints = [
      [x+0.2, y+0.2],
      [x+0.8, y+0.2],
      [x+0.2, y+0.8],
      [x+0.8, y+0.8],
    ]

    for (const point of checkPoints) {
      const [pointX, pointY] = point
      if (this.#pointTouchingPixel(pointX, pointY)) {
        return true
      }
    }

    return false
  }

  update() {
    const MOVEMENT_SPEED = 5

    const deltaTime = (Date.now() - this.lastMovement)/1000
    this.lastMovement = Date.now()

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

    if (xChange === 0 && yChange === 0) {
      return
    }

    const oldPos = this.player.getPosition()
    
    let xDirection
    let yDirection

    if (xChange > 0) {
      xDirection = 0
    } else if (xChange < 0) {
      xDirection = Math.PI
    }

    if (yChange > 0) {
      yDirection = Math.PI / 2
    } else if (yChange < 0) {
      yDirection = Math.PI * 3 / 2
    }

    let actualDirection = 0

    if (xDirection !== undefined && yDirection !== undefined) {
      actualDirection = Math.atan2(yChange, xChange)
    } else if (xDirection !== undefined) {
      actualDirection = xDirection
    } else if (yDirection !== undefined) {
      actualDirection = yDirection
    }

    if (actualDirection < 0) {
      actualDirection += Math.PI * 2
    }

    const newPos = [
      oldPos[0] + Math.cos(actualDirection) * deltaTime * MOVEMENT_SPEED,
      oldPos[1] + Math.sin(actualDirection) * deltaTime * MOVEMENT_SPEED
    ]

    newPos[0] = Math.floor(newPos[0] * 1000) / 1000
    newPos[1] = Math.floor(newPos[1] * 1000) / 1000

    if (this.#playerTouchingPixel(newPos[0], newPos[1])) {
      return
    }

    this.player.setPosition(newPos[0], newPos[1])
  }
}
