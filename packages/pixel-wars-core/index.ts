import World from "./world"
import Player from "./player"

export default class PixelWarsCore {
  private inMultiplayer: boolean

  private worlds: World[]
  private players: Player[]

  constructor(inMultiplayer?: boolean) {
    console.info("STARTING PIXEL WARS CORE")
    if (inMultiplayer) {
      console.info("Running core in multiplayer mode")
    } else {
      console.info("Running core in singleplayer mode")
    }

    if (inMultiplayer) {
      this.inMultiplayer = true
    } else {
      this.inMultiplayer = false
    }

    this.worlds = []
    this.players = []

    this.createDefaultWorld()
  }

  createDefaultWorld() {
    this.worlds.push(new World())
  }

  getDefaultWorld() {
    return this.worlds[0]
  }

  addWorld(world: World) {
    this.worlds.push(world)
  }

  removeWorld(world: World) {
    const i = this.worlds.indexOf(world)

    if (i >= 0)
      this.worlds.splice(i, 1)

    if (!this.getDefaultWorld())
      this.createDefaultWorld()

    const defaultWorld = this.getDefaultWorld()

    for (let i=0;i<this.players.length;i++) {
      if (this.players[i].getWorld() === world)
        this.players[i].setWorld(defaultWorld)
    }
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }

  getPlayers() {
    return this.players
  }

  getWorlds() {
    return this.worlds
  }

  isInMultiplayer() {
    return this.inMultiplayer
  }
}
