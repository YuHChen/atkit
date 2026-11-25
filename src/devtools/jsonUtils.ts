import { Json, JsonArray, JsonObject } from "../data/types";

export const prettyPrint = (json: Json): string =>
  "string" === typeof json ? json : JSON.stringify(json, null, 2);

export const getDefinedKeys = (obj: JsonObject): string[] =>
  Object.keys(obj).filter((key) => undefined !== obj[key]);

export interface Processors<N, A, O, P> {
  nullHandler: () => N;
  arrayHandler: (array: JsonArray) => A;
  objectHandler: (obj: JsonObject) => O;
  primativeHandler: (primative: string | number | boolean) => P;
}

export const processJson = <N, A, O, P>(
  json: Json,
  processors: Partial<Processors<N, A, O, P>>,
) => {
  const identity = () => json;
  if (null === json) {
    return (processors.nullHandler ?? identity)();
  } else if (Array.isArray(json)) {
    return (processors.arrayHandler ?? identity)(json);
  } else if ("object" === typeof json) {
    return (processors.objectHandler ?? identity)(json);
  } else {
    return (processors.primativeHandler ?? identity)(json);
  }
};

export type Handlers = Processors<void, void, void, void>;

export const handleJson = (json: Json, handlers: Partial<Handlers>) =>
  processJson(json, handlers);
