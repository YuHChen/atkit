type Json = { [key: string]: any };

type ApiResult = string | Json | undefined;

type Api = () => Promise<ApiResult>;

interface AnimationThrowdownApi {
  fetchCardsData: Api;
}

export type { AnimationThrowdownApi, Api, ApiResult };
