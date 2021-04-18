import type { AnimationThrowdownApi, Api, ApiResult } from "../types";

import type { Cache, CacheCtor } from "./types";

class CachedAnimationThrowdownApi implements AnimationThrowdownApi {
  private animationThrowdownApi: AnimationThrowdownApi;
  private cache: Cache;

  constructor(api: AnimationThrowdownApi, cache: Cache) {
    this.animationThrowdownApi = api;
    this.cache = cache;
  }

  /**
   * Wraps an individual API with the cache.
   *
   * @param api The underlying API call to cache.
   * @returns `Api` with caching capabilities.
   */
  private async withCache(api: Api): Promise<ApiResult> {
    const key = api.name;
    if (await this.cache.contains(key)) {
      return this.cache.get(key);
    } else {
      const value = api.call(this.animationThrowdownApi);
      this.cache.put(key, value);
      return value;
    }
  }

  fetchCardsData() {
    return this.withCache(this.animationThrowdownApi.fetchCardsData);
  }
}

/**
 * Wraps an `AnimationThrowdownApi` with a `Cache`.
 *
 * @param api The underlying `AnimationThrowdownApi` to cache.
 * @param cacheOrCtor The `Cache` implementation or constructor.
 * @returns `AnimationThrowdownApi` with caching capabilities.
 */
const withCache = (
  api: AnimationThrowdownApi,
  cacheOrCtor: Cache | CacheCtor
): AnimationThrowdownApi => {
  const cache =
    typeof cacheOrCtor === "object" ? cacheOrCtor : new cacheOrCtor();
  return new CachedAnimationThrowdownApi(api, cache);
};

export default withCache;
