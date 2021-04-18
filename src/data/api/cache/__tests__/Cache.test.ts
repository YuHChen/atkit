import each from "jest-each";

import type { Cache, CacheCtor } from "../types";
import MemoryCache from "../MemoryCache";

const NO_ENTRY_KEY = "no entry";

const STRING_KEY = "string data";
const STRING_DATA = "hello world";

const JSON_KEY = "json data";
const JSON_DATA = {
  hello: "world",
  foo: "bar",
};

type CacheTestParams = {
  ctor: CacheCtor;
  name: string;
};

each`
  ctor           | name
  ${MemoryCache} | ${"MemoryCache"}
`.describe("$name", ({ ctor }: CacheTestParams) => {
  const setUpCache = async () => {
    const cache = new ctor();

    await cache.put(STRING_KEY, STRING_DATA);
    await cache.put(JSON_KEY, JSON_DATA);

    return cache;
  };

  describe("contains", () => {
    test.concurrent(
      "given cache does not contain entry, then returns false",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.contains("test");
        expect(actual).toBeFalsy();
      }
    );

    test.concurrent(
      "given cache contains entry, then returns true",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.contains("json data");
        expect(actual).toBeTruthy();
      }
    );
  });

  describe("get", () => {
    test.concurrent(
      "given cache does not contain entry, then returns Promise resolved with undefined",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.get(NO_ENTRY_KEY);
        expect(actual).toBeUndefined();
      }
    );

    test.concurrent(
      "given cache contains entry, then returns Promise resolved with value",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.get(STRING_KEY);
        expect(actual).toEqual(STRING_DATA);
      }
    );
  });

  describe("put", () => {
    test.concurrent(
      "given cache does not contain entry, then returns Promise resolved with undefined",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.put("new test data", {
          test: "new test data",
        });
        expect(actual).toBeUndefined();
      }
    );

    test.concurrent(
      "given cache contains entry, then returns Promise resolved with old value",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.put(STRING_KEY, "should be overwritten");
        expect(actual).toEqual(STRING_DATA);
      }
    );

    test.concurrent(
      "given rejected Promise, then returns Promise resolved with undefined",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.put(
          "new test data",
          Promise.reject(new Error("test error"))
        );
        expect(actual).toBeUndefined();
      }
    );

    test.concurrent(
      "given Promise value, then puts entry correctly",
      async () => {
        const cache = await setUpCache();

        const noPreviousValue = await cache.put(
          "new test data",
          Promise.resolve({
            test: "new test data",
          })
        );
        expect(noPreviousValue).toBeUndefined();

        const hasPreviousValue = await cache.put(
          STRING_KEY,
          Promise.resolve("should be overwritten")
        );
        expect(hasPreviousValue).toEqual(STRING_DATA);
      }
    );
  });

  const testHelperRemovesAllEntries = (
    action: (cache: Cache) => Promise<number | boolean>
  ) => async () => {
    const cache = await setUpCache();

    await action(cache);

    const stringData = await cache.get(STRING_KEY);
    expect(stringData).toBeUndefined();

    const jsonData = await cache.get(JSON_KEY);
    expect(jsonData).toBeUndefined();
  };

  describe("clear", () => {
    test.concurrent("given empty cache, then returns 0", async () => {
      const cache = new ctor();
      const actual = await cache.clear();
      expect(actual).toEqual(0);
    });

    test.concurrent(
      "given non-empty cache, then returns old size",
      async () => {
        const cache = await setUpCache();
        const actual = await cache.clear();
        expect(actual).toEqual(2);
      }
    );

    test.concurrent(
      "removes all entries",
      testHelperRemovesAllEntries((cache) => cache.clear())
    );
  });

  describe("reset", () => {
    test.concurrent(
      "removes all entries",
      testHelperRemovesAllEntries((cache) => cache.reset())
    );
  });
});
