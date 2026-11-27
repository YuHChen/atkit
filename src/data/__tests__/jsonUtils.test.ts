import {
  getDefinedKeys,
  handleJson,
  Handlers,
  prettyPrint,
  processJson,
  Processors,
} from "../jsonUtils";
import { JsonObject } from "../types";

describe("jsonUtils", () => {
  describe("getDefinedKeys", () => {
    test("returns only keys with defined values", () => {
      expect(
        getDefinedKeys({
          foo: "bar",
          null: null,
          undef: undefined,
        } as unknown as JsonObject),
      ).toStrictEqual(["foo", "null"]);
    });
  });

  describe("handleJson", () => {
    let capture = "";
    const handlers = {
      null: () => {
        capture = "handled null";
      },
      array: (array) => {
        capture = `handled array with length: ${array.length}`;
      },
      object: (obj) => {
        capture = `handled object with keys: ${Object.keys(obj).toString()}`;
      },
      primative: (primative) => {
        capture = `handled primative of type: ${typeof primative}`;
      },
    } satisfies Handlers;

    beforeEach(() => {
      capture = "";
    });

    test("handles null", () => {
      handleJson(null, {});
      expect(capture).toEqual("");

      handleJson(null, handlers);
      expect(capture).toEqual("handled null");
    });

    test("handles array", () => {
      handleJson([1, 2, 3], {});
      expect(capture).toEqual("");

      handleJson([1, 2, 3], handlers);
      expect(capture).toEqual("handled array with length: 3");
    });

    test("handles object", () => {
      handleJson({ "1": 1, "2": 2, "3": 3 }, {});
      expect(capture).toEqual("");

      handleJson({ "1": 1, "2": 2, "3": 3 }, handlers);
      expect(capture).toEqual("handled object with keys: 1,2,3");
    });

    test("handles primatives", () => {
      handleJson("test", {});
      expect(capture).toEqual("");

      handleJson("test", handlers);
      expect(capture).toEqual("handled primative of type: string");

      handleJson(1, handlers);
      expect(capture).toEqual("handled primative of type: number");

      handleJson(true, handlers);
      expect(capture).toEqual("handled primative of type: boolean");
    });
  });

  describe("prettyPrint", () => {
    test("returns value as is given string", () => {
      expect(prettyPrint("test")).toEqual("test");
    });

    test("returns pretty string given non-string", () => {
      expect(prettyPrint(42)).toEqual("42");
      expect(prettyPrint(true)).toEqual("true");
      expect(prettyPrint({ foo: { bar: "baz" } })).toEqual(
        '{\n  "foo": {\n    "bar": "baz"\n  }\n}',
      );
      expect(prettyPrint(["test"])).toEqual('[\n  "test"\n]');
    });
  });

  describe("processJson", () => {
    const processors = {
      null: () => "processed null",
      array: (array) => `processed array with length: ${array.length}`,
      object: (obj) =>
        `processed object with keys: ${Object.keys(obj).toString()}`,
      primative: (primative) =>
        `processed primative of type: ${typeof primative}`,
    } satisfies Processors<string, string, string, string>;

    test("processes null", () => {
      expect(processJson(null, {})).toEqual(null);
      expect(processJson(null, processors)).toEqual("processed null");
    });

    test("processes array", () => {
      expect(processJson([1, 2, 3], {})).toStrictEqual([1, 2, 3]);
      expect(processJson([1, 2, 3], processors)).toEqual(
        "processed array with length: 3",
      );
    });

    test("processes object", () => {
      expect(processJson({ "1": 1, "2": 2, "3": 3 }, {})).toStrictEqual({
        "1": 1,
        "2": 2,
        "3": 3,
      });
      expect(processJson({ "1": 1, "2": 2, "3": 3 }, processors)).toEqual(
        "processed object with keys: 1,2,3",
      );
    });

    test("processes primatives", () => {
      expect(processJson("test", {})).toEqual("test");
      expect(processJson(1, {})).toEqual(1);
      expect(processJson(true, {})).toEqual(true);

      expect(processJson("test", processors)).toEqual(
        "processed primative of type: string",
      );
      expect(processJson(1, processors)).toEqual(
        "processed primative of type: number",
      );
      expect(processJson(true, processors)).toEqual(
        "processed primative of type: boolean",
      );
    });
  });
});
