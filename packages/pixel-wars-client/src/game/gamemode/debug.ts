import type PixelWarsCore from "pixel-wars-core";
import PixelWarsGamemode from ".";
import World from "pixel-wars-core/world";
import type { WorldChangeEvent } from "pixel-wars-core/player";

export default class DebugGamemode extends PixelWarsGamemode {

  constructor(core: PixelWarsCore) {
    super(core)

    const world = new World()
    world.setPixelTypes([
      {
        colour: "#ffffff"
      },
      {
        colour: "#000000"
      },
      {
        colour: "#ff0000",
        staticTexture: "/assets/img/pixel/debug/static.png"
      },
      {
        colour: "#00ff00",
        animatedTexture: {
          frames: [
            {
              texture: "/assets/img/pixel/debug/animated/frame-1.png",
              time: 1000
            },
            {
              texture: "/assets/img/pixel/debug/animated/frame-2.png",
              time: 1000
            },
            {
              texture: "/assets/img/pixel/debug/animated/frame-3.png",
              time: 1000
            }
          ]
        }
      }
    ])
    core.addWorld(world)

    core.setSetting("downloadingEnabled", true)
    core.setSetting("importingEnabled", true)

    core.onPlayerAdded((event) => {
      const player = event.getPlayer()
      player.setPixelInventory([1, 2, 3])

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
