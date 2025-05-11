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
  private keyUpListeners: ((keyType?: string) => void)[]

  constructor() {
    this.pressedKeys = []
    this.keyUpListeners = []

    document.addEventListener("keydown", (event) => {
      const key = event.key.toUpperCase()

      if (!this.pressedKeys.includes(key)) {
        this.pressedKeys.push(key)
      }
    })

    document.addEventListener("keyup", (event) => {
      const key = event.key.toUpperCase()

      const i = this.pressedKeys.indexOf(key)
      if (i >= 0)
        this.pressedKeys.splice(i, 1)

      this.#callListeners(this.keyUpListeners, KEYBINDS[key])
    })
  }

  #callListeners(callbacks: ((keyType?: string) => void)[], keyType?: string) {
    for (let i=0;i<callbacks.length;i++) {
      callbacks[i](keyType)
    }
  }

  onKeyUp(callback: (keyType?: string) => void) {
    this.keyUpListeners.push(callback)
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
