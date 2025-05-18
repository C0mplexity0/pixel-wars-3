import World from "./world"
import Player from "./player"
import { Event, EventHandler, type Listener } from "./event"

export interface PixelWarsCoreSettings {
  downloadingEnabled: boolean,
  importingEnabled: boolean
}

export class SettingsUpdatedEvent extends Event {
  private newSettings: PixelWarsCoreSettings

  constructor(newSettings: PixelWarsCoreSettings) {
    super()
    this.newSettings = newSettings
  }

  getNewSettings() {
    return this.newSettings
  }
}

export class PlayerAddedEvent extends Event {
  private player: Player

  constructor(player: Player) {
    super()
    this.player = player
  }

  getPlayer() {
    return this.player
  }
}

export default class PixelWarsCore {
  private inMultiplayer: boolean

  private settings: PixelWarsCoreSettings

  private worlds: World[]
  private players: Player[]

  private onSettingsUpdatedEvent: EventHandler<SettingsUpdatedEvent>
  private onPlayerAddedEvent: EventHandler<PlayerAddedEvent>

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

    this.settings = PixelWarsCore.getDefaultSettings()

    this.worlds = []
    this.players = []

    this.onSettingsUpdatedEvent = new EventHandler()
    this.onPlayerAddedEvent = new EventHandler()
  }

  static getDefaultSettings(): PixelWarsCoreSettings {
    return {
      downloadingEnabled: false,
      importingEnabled: false
    }
  }

  setSetting<T extends keyof PixelWarsCoreSettings>(setting: T, value: PixelWarsCoreSettings[T]) {
    this.settings[setting] = value
    this.onSettingsUpdatedEvent.fire(new SettingsUpdatedEvent(this.settings))
  }

  onSettingsUpdated(callback: Listener<SettingsUpdatedEvent>) {
    this.onSettingsUpdatedEvent.addListener(callback)
  }

  offSettingsUpdated(callback: Listener<SettingsUpdatedEvent>) {
    this.onSettingsUpdatedEvent.removeListener(callback)
  }

  getSettings() {
    return this.settings
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

    const defaultWorld = this.getDefaultWorld()

    for (let i=0;i<this.players.length;i++) {
      if (this.players[i].getWorld() === world)
        this.players[i].setWorld(defaultWorld)
    }
  }

  addPlayer(player: Player, world: World=this.getDefaultWorld()) {
    if (!world)
      throw new Error("Can't add new player to core, there is no world to add them to!")

    player.setWorld(world)
    this.players.push(player)
    this.onPlayerAddedEvent.fire(new PlayerAddedEvent(player))
  }

  removePlayer(player: Player) {
    const i = this.players.indexOf(player)
    if (i >= 0)
      this.players.splice(i, 1)
  }

  onPlayerAdded(callback: Listener<PlayerAddedEvent>) {
    this.onPlayerAddedEvent.addListener(callback)
  }

  offPlayerAdded(callback: Listener<PlayerAddedEvent>) {
    this.onPlayerAddedEvent.addListener(callback)
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
