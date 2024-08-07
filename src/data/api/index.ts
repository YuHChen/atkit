import MemoryCache from "./cache/MemoryCache";
import withCache from "./cache/withCache";
import type { AnimationThrowdownApi, ApiResult } from "./types";
import xmlToJson from "./xmlToJson";

const ENDPOINTS = {
  CARDS: "https://cb-live.synapse-games.com/assets/cards.xml",
  COMBOS: "https://cb-live.synapse-games.com/assets/combos.xml",
};

class AnimationThrowdown implements AnimationThrowdownApi {
  private parser: DOMParser = new DOMParser();

  private async fetchData(url: string): Promise<ApiResult> {
    const response = await fetch(url);
    const text = await response.text();
    const xml = this.parser.parseFromString(text, "text/xml");
    return xmlToJson(xml);
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

export { ENDPOINTS, CACHED_INSTANCE as CachedAnimationThrowdown };
