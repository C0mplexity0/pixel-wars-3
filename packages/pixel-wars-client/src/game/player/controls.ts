import { EventHandler, type Listener } from "pixel-wars-core/event"

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

export class KeyEvent {
  private keyType: string

  constructor(keyType: string) {
    this.keyType = keyType
  }

  getKeyType() {
    return this.keyType
  }
}

export default class ControlsHandler {
  private pressedKeys: string[]

  private onKeyUpEvent: EventHandler<KeyEvent>
  private onKeyDownEvent: EventHandler<KeyEvent>

  constructor() {
    this.pressedKeys = []

    this.onKeyUpEvent = new EventHandler()
    this.onKeyDownEvent = new EventHandler()

    document.addEventListener("keydown", (event) => {
      const key = event.key.toUpperCase()

      if (!this.pressedKeys.includes(key)) {
        this.pressedKeys.push(key)
        const event = new KeyEvent(KEYBINDS[key])
        this.onKeyDownEvent.fire(event)
      }
    })

    document.addEventListener("keyup", (event) => {
      const key = event.key.toUpperCase()

      const i = this.pressedKeys.indexOf(key)
      if (i >= 0)
        this.pressedKeys.splice(i, 1)

      const keyEvent = new KeyEvent(KEYBINDS[key])
      this.onKeyUpEvent.fire(keyEvent)
    })
  }

  onKeyUp(callback: Listener<KeyEvent>) {
    this.onKeyUpEvent.addListener(callback)
  }

  offKeyUp(callback: Listener<KeyEvent>) {
    this.onKeyUpEvent.removeListener(callback)
  }

  onKeyDown(callback: Listener<KeyEvent>) {
    this.onKeyDownEvent.addListener(callback)
  }

  offKeyDown(callback: Listener<KeyEvent>) {
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
