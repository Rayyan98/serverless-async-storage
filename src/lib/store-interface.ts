export interface StoreI {
  getFromStore(key: string): any;
  setInStore(key: string, value: any): void;
  clearStore(): void;
}
