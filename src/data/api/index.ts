import MemoryCache from "./cache/MemoryCache";
import withCache from "./cache/withCache";
import type { AnimationThrowdownApi, ApiResult } from "./types";

const ENDPOINTS = {
  CARDS: new URL("../../assets/data/cards.json", import.meta.url).href,
  COMBOS: new URL("../../assets/data/combos.json", import.meta.url).href,
};

class AnimationThrowdown implements AnimationThrowdownApi {
  private async fetchData(url: string): Promise<ApiResult> {
    const response = await fetch(url);
    return response.json();
  }

  fetchCardsData(): Promise<ApiResult> {
    return this.fetchData(ENDPOINTS.CARDS);
  }

  fetchCombosData(): Promise<ApiResult> {
    return this.fetchData(ENDPOINTS.COMBOS);
  }
}

const INSTANCE = new AnimationThrowdown();
const CACHED_INSTANCE = withCache(INSTANCE, MemoryCache);

export default INSTANCE;

export { CACHED_INSTANCE as CachedAnimationThrowdown, ENDPOINTS };
