import MemoryCache from "./cache/MemoryCache";
import withCache from "./cache/withCache";
import type { AnimationThrowdownApi, ApiResult } from "./types";
import xmlToJson from "./xmlToJson";

const ENDPOINTS = {
  CARDS: "http://cb-live.synapse-games.com/assets/cards.xml",
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
}

const INSTANCE = new AnimationThrowdown();
const CACHED_INSTANCE = withCache(INSTANCE, MemoryCache);

export default INSTANCE;

export { ENDPOINTS, CACHED_INSTANCE as CachedAnimationThrowdownApi };
