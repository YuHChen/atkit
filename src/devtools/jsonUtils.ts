import { Json, JsonArray, JsonObject } from "./types";

const prettyPrint = (json: Json): string =>
  "string" === typeof json ? json : JSON.stringify(json, null, 2);

interface Handlers {
  nullHandler: () => void;
  arrayHandler: (array: JsonArray) => void;
  objectHandler: (obj: JsonObject) => void;
  primativeHandler: (primative: string | number | boolean) => void;
}

const handleJson = (json: Json, handlers: Handlers) => {
  if (null === json) {
    handlers.nullHandler();
  } else if (Array.isArray(json)) {
    handlers.arrayHandler(json);
  } else if ("object" === typeof json) {
    handlers.objectHandler(json);
  } else {
    handlers.primativeHandler(json);
  }
};

export type { Handlers };

export { handleJson, prettyPrint };
