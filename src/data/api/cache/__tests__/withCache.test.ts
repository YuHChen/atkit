import { Mock, vi } from "vitest";
import { AnimationThrowdownApi } from "../../types";
import { Cache, CacheCtor } from "../types";
import withCache from "../withCache";

const mockAnimationThrowdownApi: AnimationThrowdownApi = {
  fetchCardsData: vi.fn(),
  fetchCombosData: vi.fn(),
};

const mockContains = vi.fn();
const mockGet = vi.fn();
const mockPut = vi.fn();
const mockCache: Cache = {
  contains: mockContains,
  get: mockGet,
  put: mockPut,
  clear: vi.fn(),
  reset: vi.fn(),
};

const mockCacheCtor: CacheCtor = vi.fn();

const mockFns = Object.values(mockAnimationThrowdownApi).concat(
  Object.values(mockCache),
) as Mock[];

describe("withCache", () => {
  beforeEach(() => {
    for (const mockFn of mockFns) {
      mockFn.mockClear();
    }
  });

  test("given cache implementation, then returns api wrapped with cache", () => {
    const actual = withCache(mockAnimationThrowdownApi, mockCache);

    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
  });

  test("given cache constructor, then returns api wrapped with cache", () => {
    const actual = withCache(mockAnimationThrowdownApi, mockCacheCtor);

    expect(mockCacheCtor).toBeCalledTimes(1);
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
  });

  type CachedApiTestParams = {
    apiName: keyof AnimationThrowdownApi;
    mockApi: Mock;
  };

  describe.each`
    apiName              | mockApi
    ${"fetchCardsData"}  | ${mockAnimationThrowdownApi.fetchCardsData}
    ${"fetchCombosData"} | ${mockAnimationThrowdownApi.fetchCombosData}
  `("$apiName", ({ apiName, mockApi }: CachedApiTestParams) => {
    test("given api was not cached, then calls api and returns value", async () => {
      const cachedApi = withCache(mockAnimationThrowdownApi, mockCache);

      mockContains.mockResolvedValue(false);
      mockPut.mockImplementationOnce(((_, result) => result) as Cache["put"]);

      mockApi.mockResolvedValue({ hello: "world" });

      const actual = await cachedApi[apiName].call(cachedApi);

      expect(mockApi).toBeCalledTimes(1);
      expect(actual).toBeDefined();
      expect(actual).not.toBeNull();
      expect(actual).toEqual({ hello: "world" });
    });

    test("given api was cached, then does not call api and returns from cache", async () => {
      const cachedApi = withCache(mockAnimationThrowdownApi, mockCache);

      mockContains.mockResolvedValue(true);
      mockGet.mockResolvedValue({ hello: "cached world" });

      const actual = await cachedApi[apiName].call(cachedApi);

      expect(mockApi).not.toHaveBeenCalled();
      expect(actual).toBeDefined();
      expect(actual).not.toBeNull();
      expect(actual).toEqual({ hello: "cached world" });
    });
  });
});
