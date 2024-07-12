import { StoreTypeEnum, StoreFactory } from "../../src/lib/store-factory";
import { TransientStore } from "../../src/lib/transient-store";

describe("StoreFactory", () => {
  describe("getStore", () => {
    it("should return an instance of TransientStore when storeType is TransientStore", () => {
      const storeType = StoreTypeEnum.TransientStore;
      const store = StoreFactory.getStore(storeType);
      expect(store).toBeInstanceOf(TransientStore);
    });

    it("should throw an error when an invalid storeType is provided", () => {
      const storeType = "InvalidStoreType" as any;
      expect(() => StoreFactory.getStore(storeType)).toThrowError("Invalid store type");
    });
  });
});
