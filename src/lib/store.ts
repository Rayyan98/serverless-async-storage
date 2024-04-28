import { AsyncLocalStorage } from 'node:async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage<Record<string, unknown>>();

export function getFromStore(key: string) {
  return asyncLocalStorage.getStore()![key];
}

export function setInStore(key: string, value: any) {
  const store = asyncLocalStorage.getStore()!;
  store[key] = value;
}
