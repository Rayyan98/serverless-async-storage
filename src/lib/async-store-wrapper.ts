import { asyncLocalStorage } from "./store";
import { StoreFactory, StoreTypeEnum } from "./store-factory";

export function asyncStoreWrapper(...args: unknown[]) {
  const splits = process.env.SAS_HANDLER!.split(".");
  const handlerName = splits.pop()!;
  const filePath = splits.join(".");

  return asyncLocalStorage.run(
    StoreFactory.getStore(StoreTypeEnum.TransientStore),
    () => {
      const fileModule = require(`${filePath}`);
      const handler = fileModule[handlerName];    
      return handler(...args);
    }
  );
}
