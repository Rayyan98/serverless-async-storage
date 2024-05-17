import { StoreI } from "./store-interface";

export class TransientStore implements StoreI {
  private store: Record<string, unknown> = {};

  getFromStore(key: string) {
    return this.store[key];
  }

  setInStore(key: string, value: any) {
    this.store[key] = value;
  }

  clearStore() {
    this.store = {};
  }
}
