export type Json = string | number | JsonObject | JsonArray | boolean | null;

export type JsonObject = { [key: string]: Json };

export type JsonArray = Json[];
