import { AsyncLocalStorage } from 'node:async_hooks';
import { StoreI } from './store-interface';

export const asyncLocalStorage = new AsyncLocalStorage<StoreI>();

export function getFromStore(key: string): any {
  return asyncLocalStorage.getStore()?.getFromStore(key);
}

export function setInStore(key: string, value: any): void {
  return asyncLocalStorage.getStore()?.setInStore(key, value);
}

export function clearStore(): void {
  return asyncLocalStorage.getStore()?.clearStore();
}
