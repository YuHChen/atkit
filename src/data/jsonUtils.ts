import { Json, JsonArray, JsonObject } from "./types";

export const prettyPrint = (json: Json): string =>
  "string" === typeof json ? json : JSON.stringify(json, null, 2);

export const getDefinedKeys = (obj: JsonObject): string[] =>
  Object.keys(obj).filter((key) => undefined !== obj[key]);

export interface Processors<N, A, O, P> {
  null: () => N;
  array: (array: JsonArray) => A;
  object: (obj: JsonObject) => O;
  primative: (primative: string | number | boolean) => P;
}

export const processJson = <N, A, O, P>(
  json: Json,
  processors: Partial<Processors<N, A, O, P>>,
) => {
  const identity = () => json;
  if (null === json) {
    return (processors.null ?? identity)();
  } else if (Array.isArray(json)) {
    return (processors.array ?? identity)(json);
  } else if ("object" === typeof json) {
    return (processors.object ?? identity)(json);
  } else {
    return (processors.primative ?? identity)(json);
  }
};

export type Handlers = Processors<void, void, void, void>;

export const handleJson = (json: Json, handlers: Partial<Handlers>) =>
  processJson(json, handlers);
