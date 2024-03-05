type Listener<T> = (data: T) => void;

export default class SimpleEventEmitter<T> {
  private listeners: Listener<T>[] = [];

  on(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  emit(data: T) {
    this.listeners.forEach(listener => {
      listener(data);
    });
  }

  off(listener: Listener<T>) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}