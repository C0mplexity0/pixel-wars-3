export default class PixelWarsEvent<T extends Parameters<(...args: any) => any>> {
  private listeners: ((...args: T) => void)[]

  constructor() {
    this.listeners = []
  }

  addListener(listener: (...args: T) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (...args: T) => void) {
    const i = this.listeners.indexOf(listener)
    if (i >= 0) {
      this.listeners.splice(i, 1)
    }
  }

  fire(...args: T) {
    for (let i=0;i<this.listeners.length;i++) {
      this.listeners[i](...args)
    }
  }
}
