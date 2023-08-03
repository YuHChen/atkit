import type { ApiResult } from "../types";

interface Cache {
  contains: (url: string) => Promise<boolean>;

  get: (url: string) => Promise<ApiResult>;

  /**
   * Associates `url` with `result`, overwriting the previous result if any.
   *
   * @returns `undefined` if Promise is rejected. otherwise,
   * returns previous value if present and `undefined` if not present.
   */
  put: (
    url: string,
    result: ApiResult | Promise<ApiResult>,
  ) => Promise<ApiResult>;

  /**
   * Removes all entries from cache.
   *
   * @returns number of entries removed.
   */
  clear: () => Promise<number>;

  /**
   * Reinitializes the cache. This could include running any setup steps again.
   * Removes all entries from cache.
   *
   * @returns `true` if successful, `false` otherwise.
   */
  reset: () => Promise<boolean>;
}

interface CacheCtor {
  new (): Cache;
}

export type { Cache, CacheCtor };
