import type PixelWarsCore from "pixel-wars-core";
import PixelWarsGamemode from ".";
import World from "pixel-wars-core/world";

export default class CreativeGamemode extends PixelWarsGamemode {

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
        colour: "#474747"
      },
      {
        colour: "#878787"
      },
      {
        colour: "#BABABA"
      },
      {
        colour: "#E53935"
      },
      {
        colour: "#B71C1C"
      },
      {
        colour: "#F57F17"
      },
      {
        colour: "#5A3D23"
      },
      {
        colour: "#FFEB3B"
      },
      {
        colour: "#95DE16"
      },
      {
        colour: "#37DE16"
      },
      {
        colour: "#1DA811"
      },
      {
        colour: "#33691E"
      },
      {
        colour: "#18C7B8"
      },
      {
        colour: "#18A7C7"
      },
      {
        colour: "#0D47A1"
      },
      {
        colour: "#6C18C7"
      },
      {
        colour: "#B218C7"
      },
      {
        colour: "#C718A1"
      },
      {
        colour: "#F06292"
      }
    ])
    core.addWorld(world)

    core.setSetting("downloadingEnabled", true)
    core.setSetting("importingEnabled", true)

    core.onPlayerAdded((event) => {
      event.getPlayer().setPixelInventory([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    })
  }
}
