import type PixelWarsCore from "pixel-wars-core";
import PixelWarsGamemode from ".";
import World from "pixel-wars-core/world";
import WorldUtils from "pixel-wars-core/world/utils";

export default class DucksGamemode extends PixelWarsGamemode {

  constructor(core: PixelWarsCore) {
    super(core)

    const world = new World()
    world.setPixelTypes([
      {
        colour: "#3688c2",
        staticTexture: "/assets/img/pixel/ducks/waves.png"
      }
    ])
    world.setGenerator(() => {
      return WorldUtils.createBlankChunk()
    })
    world.setVisiblePixelRadius(15)
    core.addWorld(world)

    core.onPlayerAdded((event) => {
      const player = event.getPlayer()
      player.setPixelInventory([])
    })
  }
}
