import { asyncLocalStorage, clearStore, getFromStore, setInStore } from "../../src/lib/store";
import { TransientStore } from "../../src/lib/transient-store";

describe('Store', () => {
  it('should set and get value from store', () => {
    asyncLocalStorage.run(new TransientStore(), () => {
      const key = 'testKey';
      const value = 'testValue';

      setInStore(key, value);
      const result = getFromStore(key);

      expect(result).toEqual(value);
    });
  });

  it('should return undefined if key does not exist in store', () => {
    asyncLocalStorage.run(new TransientStore(), () => {
      const key = 'nonExistentKey';
      const result = getFromStore(key);

      expect(result).toBeUndefined();
    })
  });

  it('should clear the store', () => {
    asyncLocalStorage.run(new TransientStore(), () => {
      const key = 'testKey';
      const value = 'testValue';
  
      setInStore(key, value);
      clearStore();
      const result = getFromStore(key);
  
      expect(result).toBeUndefined();  
    })
  });
});
