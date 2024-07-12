import { StoreI } from "./store-interface";
import { TransientStore } from "./transient-store";

export enum StoreTypeEnum {
  TransientStore = 'TransientStore',
}

export class StoreFactory {
  static getStore(storeType: StoreTypeEnum): StoreI {
    switch (storeType) {
      case StoreTypeEnum.TransientStore:
        return new TransientStore();
      default:
        throw new Error('Invalid store type');
    }
  }
};
