export class Event {}

export class CancellableEvent extends Event {
  protected cancelled: boolean

  constructor() {
    super()
    this.cancelled = false
  }

  cancel() {
    this.cancelled = true
  }
}

export type Listener<T extends Event> = (event: T) => void

export class EventHandler<T extends Event> {
  
  private listeners: Listener<T>[]

  constructor() {
    this.listeners = []
  }

  addListener(listener: Listener<T>) {
    this.listeners.push(listener)
  }

  removeListener(listener: Listener<T>) {
    const i = this.listeners.indexOf(listener)

    if (i)
      this.listeners.splice(i, 1)
  }

  fire(event: T) {
    for (let i=0;i<this.listeners.length;i++)
      this.listeners[i](event)
  }
}
