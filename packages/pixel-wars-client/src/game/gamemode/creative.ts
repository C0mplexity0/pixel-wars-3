import type PixelWarsCore from "pixel-wars-core";
import PixelWarsGamemode from ".";
import World from "pixel-wars-core/world";

export default class CreativeGamemode extends PixelWarsGamemode {

  constructor(core: PixelWarsCore) {
    super(core)

    const world = new World()
    core.addWorld(world)

    core.setSetting("downloadingEnabled", true)
    core.setSetting("importingEnabled", true)
  }
}
