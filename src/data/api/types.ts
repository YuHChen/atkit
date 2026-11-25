import { Json } from "../types";

export type ApiResult = Json | undefined;

export type Api = () => Promise<ApiResult>;

export interface AnimationThrowdownApi {
  fetchCardsData: Api;
  fetchCombosData: Api;
}
