import { PerpetualStore } from "./perpetual-store";
import { StoreI } from "./store-interface";
import { TransientStore } from "./transient-store";

export enum StoreTypeEnum {
  TransientStore = 'TransientStore',
  PerpetualStore = 'PerpetualStore',
}

export class StoreFactory {
  static getStore(storeType: StoreTypeEnum): StoreI {
    switch (storeType) {
      case StoreTypeEnum.TransientStore:
        return new TransientStore();
      case StoreTypeEnum.PerpetualStore:
        return new PerpetualStore();
      default:
        throw new Error('Invalid store type');
    }
  }
};
