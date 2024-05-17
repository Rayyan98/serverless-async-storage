import { StoreI } from "./store-interface";

let store: Record<string, unknown> = {};

export class PerpetualStore implements StoreI {
  getFromStore(key: string) {
    return store[key];
  }

  setInStore(key: string, value: any) {
    store[key] = value;
  }

  clearStore() {
    store = {};
  }
}
