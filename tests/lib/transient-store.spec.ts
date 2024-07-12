import { TransientStore } from "../../src/lib/transient-store";

describe("TransientStore", () => {
  let store: TransientStore;

  beforeEach(() => {
    store = new TransientStore();
  });

  it("should set and get values from the store", () => {
    const key = "testKey";
    const value = "testValue";

    store.setInStore(key, value);
    const result = store.getFromStore(key);

    expect(result).toEqual(value);
  });

  it("should return undefined for non-existent keys", () => {
    const key = "nonExistentKey";

    const result = store.getFromStore(key);

    expect(result).toBeUndefined();
  });

  it("should clear the store", () => {
    const key = "testKey";
    const value = "testValue";

    store.setInStore(key, value);
    store.clearStore();
    const result = store.getFromStore(key);

    expect(result).toBeUndefined();
  });
});
