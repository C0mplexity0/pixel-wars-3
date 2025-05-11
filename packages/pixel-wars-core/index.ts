import World from "./world"
import Player from "./player"

export default class PixelWarsCore {
  private inMultiplayer: boolean

  private started: boolean

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

    this.started = false

    this.worlds = []
    this.players = []
  }

  createDefaultWorld() {
    this.worlds.push(new World())
  }

  getDefaultWorld() {
    return this.worlds[0]
  }

  start() {
    if (this.started) {
      return
    }

    this.started = true

    this.createDefaultWorld()
  }

  addPlayer(player: Player) {
    this.players.push(player)
  }

  getPlayers() {
    return this.players
  }

  isInMultiplayer() {
    return this.inMultiplayer
  }
}
