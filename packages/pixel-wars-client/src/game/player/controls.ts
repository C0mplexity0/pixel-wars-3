import PixelWarsEvent from "pixel-wars-core/event"

const KEYBINDS: {[key: string]: string} = {
  "ARROWUP": "UP",
  "W": "UP",

  "ARROWLEFT": "LEFT",
  "A": "LEFT",

  "ARROWDOWN": "DOWN",
  "S": "DOWN",

  "ARROWRIGHT": "RIGHT",
  "D": "RIGHT",

  "SHIFT": "BUILD_MODE"
}

export default class ControlsHandler {
  private pressedKeys: string[]

  private onKeyUpEvent: PixelWarsEvent<Parameters<(keybind: string) => void>>
  private onKeyDownEvent: PixelWarsEvent<Parameters<(keybind: string) => void>>

  constructor() {
    this.pressedKeys = []

    this.onKeyUpEvent = new PixelWarsEvent()
    this.onKeyDownEvent = new PixelWarsEvent()

    document.addEventListener("keydown", (event) => {
      const key = event.key.toUpperCase()

      if (!this.pressedKeys.includes(key)) {
        this.pressedKeys.push(key)
        this.onKeyDownEvent.fire(KEYBINDS[key])
      }
    })

    document.addEventListener("keyup", (event) => {
      const key = event.key.toUpperCase()

      const i = this.pressedKeys.indexOf(key)
      if (i >= 0)
        this.pressedKeys.splice(i, 1)

      this.onKeyUpEvent.fire(KEYBINDS[key])
    })
  }

  onKeyUp(callback: (keyType?: string) => void) {
    this.onKeyUpEvent.addListener(callback)
  }

  offKeyUp(callback: (keyType?: string) => void) {
    this.onKeyUpEvent.removeListener(callback)
  }

  onKeyDown(callback: (keyType?: string) => void) {
    this.onKeyDownEvent.addListener(callback)
  }

  offKeyDown(callback: (keyType?: string) => void) {
    this.onKeyDownEvent.removeListener(callback)
  }

  getPressedKeys() {
    return this.pressedKeys
  }

  keyTypePressed(type: string) {
    for (let i=0;i<this.pressedKeys.length;i++) {
      if (KEYBINDS[this.pressedKeys[i]] === type) {
        return true
      }
    }

    return false
  }
}
