import { Json } from "../types";

type ApiResult = Json | undefined;

type Api = () => Promise<ApiResult>;

interface AnimationThrowdownApi {
  fetchCardsData: Api;
  fetchCombosData: Api;
}

export type { AnimationThrowdownApi, Api, ApiResult };
