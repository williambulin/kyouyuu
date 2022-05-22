class LocalStorage {
  constructor() {
    this.storage = window.localStorage;
    this.listeners = [];
  }

  get(key) {
    return this.storage.getItem(key);
  }

  set(key, value) {
    this.storage.setItem(key, value);
    for (let listener of this.listeners)
      listener(key, value);
  }

  remove(key) {
    this.storage.removeItem(key);
    for (let listener of this.listeners)
      listener(key, null);
  }

  clear() {
    this.storage.clear();
    for (let listener of this.listeners)
      listener(null, null);
  }

  get length() {
    return this.storage.length;
  }

  key(index) {
    return this.storage.key(index);
  }

  addListener(listener) {
    this.listeners.push(listener);
    listener(null, null);
    for (let i = 0; i < this.length; ++i) {
      let key = this.key(i);
      let value = this.get(key);
      listener(key, value);
    }
  }

  removeListener(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }
};

export const storage = new LocalStorage();

window.addEventListener('storage', (event) => {
  for (let listener of storage.listeners)
    listener(event.key, event.newValue);
});
