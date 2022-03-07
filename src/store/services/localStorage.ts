export type LocalStorageItem = {
  key: string;
  value: null | string | number;
};

export enum LocalStorageKey {
  token = '_token',
  tokenExpired = '_expired',
  fullName = '_fullName',
  account = '_account',
  id = '_id',
  info = '_info',
}

export class LocalStorageService {
  public _value: any;
  public _key: any;

  set value(newValue: any) {
    this._value = newValue;
  }

  set key(newKey: any) {
    this._key = newKey;
  }

  get value() {
    return this._value;
  }

  get key() {
    return this._key;
  }

  public setItem({ key, value }: LocalStorageItem): LocalStorageService {
    localStorage.setItem(key, JSON.stringify(value));
    return this;
  }

  public setInfoUser(user: any): this {
    const listLocalStorageItem: LocalStorageItem = {
      key: LocalStorageKey.info,
      value: user,
    };
    this.setItem(listLocalStorageItem);
    return this;
  }

  public getItem(key: string): string | null {
    const value: any = localStorage.getItem(key);
    if (value === null || value === 'undefined') return null;
    return JSON.parse(value);
  }

  static clearLocalStorage() {
    localStorage.clear();
  }

  public expiredToken(tokenExpirendTime: number): boolean {
    if (tokenExpirendTime) {
      return +tokenExpirendTime < new Date().getTime();
    }
    return false;
  }
}
