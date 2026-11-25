import { ApiResult } from "../types";
import { Cache } from "./types";

export default class MemoryCache implements Cache {
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

  async put(url: string, result: ApiResult | Promise<ApiResult>) {
    const resultPromise = Promise.resolve(result);

    const oldValue = this.get(url);

    try {
      this.cache.set(url, await resultPromise);
      return oldValue;
    } catch (_) {
      return Promise.resolve(undefined);
    }
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
