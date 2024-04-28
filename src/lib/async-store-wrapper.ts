import { asyncLocalStorage } from "./store";

export function asyncStoreWrapper(event: unknown, context: unknown, callback: unknown) {
  return asyncLocalStorage.run({}, () => {
    const splits = process.env.SAS_HANDLER!.split('.');
    const handlerName = splits.pop()!;
    const filePath = splits.join('.');

    const handler = require(`${filePath}`)[handlerName];
    return handler(event, context, callback);
  })
}
