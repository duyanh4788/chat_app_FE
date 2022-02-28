import * as _ from 'lodash';

export type LocalStorageItem = {
  key: string;
  value: string | number;
};

export enum LocalStorageKey {
  token = '_token',
  tokenExpired = '_expired',
  fullName = '_fullName',
  account = '_account',
  id = '_id',
}

export class LocalStorageService {
  public _value: any;
  public _key: any;
  public initValue: any;

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

  constructor(initValue?: any) {
    this.initValue = initValue;
  }

  public setItem({ key, value }: LocalStorageItem): LocalStorageService {
    localStorage.setItem(key, JSON.stringify(value));
    return this;
  }

  public getItem(key: string): string | null {
    const value: any = localStorage.getItem(key);
    if (value === null || value === 'undefined') return null;
    return JSON.parse(value);
  }

  public removeItem(key: LocalStorageKey): LocalStorageService {
    localStorage.removeItem(key);
    return this;
  }

  static clearLocalStorage() {
    localStorage.clear();
  }

  public setMultipleItem(listItem: LocalStorageItem[]): LocalStorageService {
    if (listItem.length) {
      listItem.forEach((item: LocalStorageItem) => {
        this.setItem({ ...item });
      });
    }
    return this;
  }
  public setLocalUser(user): this {
    const listLocalStorageItem: LocalStorageItem[] = [];
    listLocalStorageItem.push({
      key: LocalStorageKey.token,
      value: _.get(user, 'toKen'),
    });
    listLocalStorageItem.push({
      key: LocalStorageKey.fullName,
      value: _.get(user, 'fullName'),
    });
    listLocalStorageItem.push({
      key: LocalStorageKey.account,
      value: _.get(user, 'account'),
    });
    listLocalStorageItem.push({
      key: LocalStorageKey.id,
      value: _.get(user, 'id'),
    });

    const expiredUser: number = new Date(+new Date() + 3600).getTime();
    listLocalStorageItem.push({
      key: LocalStorageKey.tokenExpired,
      value: expiredUser,
    });
    this.setMultipleItem(listLocalStorageItem);
    return this;
  }

  public expiredToken(tokenExpirendTime: number): boolean {
    if (tokenExpirendTime) {
      return +tokenExpirendTime < new Date().getTime();
    }
    return false;
  }
}
