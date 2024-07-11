type Json = string | number | JsonObject | JsonArray | boolean | null;

type JsonObject = { [key: string]: Json };

type JsonArray = Json[];

export type { Json, JsonArray, JsonObject };
