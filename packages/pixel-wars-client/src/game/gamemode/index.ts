import type PixelWarsCore from "pixel-wars-core"
import type Player from "pixel-wars-core/player"

export default class PixelWarsGamemode {

  protected core: PixelWarsCore

  constructor(core: PixelWarsCore) {
    this.core = core
  }

  addPlayer(player: Player) {
    this.core.addPlayer(player)
  }

  getCore() {
    return this.core
  }
}
