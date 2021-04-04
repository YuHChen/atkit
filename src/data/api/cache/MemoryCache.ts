import { ApiResult } from "../types";

import { Cache } from "./types";

class MemoryCache implements Cache {
  private cache: Map<string, ApiResult>;

  constructor() {
    this.cache = new Map();
  }

  contains(url: string) {
    return Promise.resolve(this.cache.has(url));
  }

  get(url: string) {
    return Promise.resolve(this.cache.get(url));
  }

  put(url: string, result: ApiResult) {
    const oldValue = this.get(url);

    this.cache.set(url, result);

    return oldValue;
  }

  clear() {
    const oldSize = this.cache.size;

    this.cache.clear();

    return Promise.resolve(oldSize);
  }

  reset() {
    this.cache = new Map();

    return Promise.resolve(true);
  }
}

export default MemoryCache;
