import type PixelWarsCore from "pixel-wars-core";
import PixelWarsGamemode from ".";
import World from "pixel-wars-core/world";
import type { WorldChangeEvent } from "pixel-wars-core/player";

export default class DucksGamemode extends PixelWarsGamemode {

  constructor(core: PixelWarsCore) {
    super(core)

    const world = new World()
    world.setPixelTypes([
      {
        colour: "#ffffff"
      }
    ])
    core.addWorld(world)

    core.setSetting("downloadingEnabled", true)
    core.setSetting("importingEnabled", true)

    core.onPlayerAdded((event) => {
      const player = event.getPlayer()
      player.setPixelInventory([])

      player.onWorldChange((event: WorldChangeEvent) => {
        const world = event.getWorld()
        const pixelInventory = []
        const pixelTypes = world.getPixelTypes()

        for (let i=1;i<pixelTypes.length;i++) {
          pixelInventory.push(i)
        }

        player.setPixelInventory(pixelInventory)
      })
    })
  }
}
