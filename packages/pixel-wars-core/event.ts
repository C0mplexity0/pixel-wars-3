/* eslint-disable @typescript-eslint/no-explicit-any */
export default class PixelWarsEvent {
  private listeners: ((...args: any[]) => void)[]

  constructor() {
    this.listeners = []
  }

  addListener(listener: (...args: any[]) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (...args: any[]) => void) {
    const i = this.listeners.indexOf(listener)
    if (i >= 0) {
      this.listeners.splice(i, 1)
    }
  }

  fire(...args: any[]) {
    for (let i=0;i<this.listeners.length;i++) {
      this.listeners[i](...args)
    }
  }
}
