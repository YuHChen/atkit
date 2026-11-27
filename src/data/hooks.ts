import { useEffect, useState } from "react";
import { CachedAnimationThrowdown } from "./api";
import { AnimationThrowdownApi, ApiResult } from "./api/types";
import { handleJson } from "./jsonUtils";
import { Json } from "./types";

const toString = (json: Json): string => new String(json).toString();

const CARD_TYPE_MAPPING: Record<string, CardType> = { final_form: "power" };
const CARD_TYPES = ["character", "object", "power", "unknown"] as const;
type CardType = (typeof CARD_TYPES)[number];
const toCardType = (input: string): CardType => {
  return (
    CARD_TYPES.find((cardType): cardType is CardType => cardType === input) ??
    CARD_TYPE_MAPPING[input] ??
    "unknown"
  );
};

export interface Card {
  // primary props (card face)
  name: string;

  // secondary props (additional details)
  type: CardType;

  // meta props
  id: string;
}

const transformCardDataToCards = (result: ApiResult): Card[] => {
  console.debug(`result: ${JSON.stringify(result)}`);

  const transformed: Card[] = [];

  handleJson(result ?? {}, {
    object: (obj) =>
      handleJson(Object.values(obj), {
        array: (cardData) =>
          cardData.forEach((cardDatum) =>
            handleJson(cardDatum, {
              object: (card) =>
                transformed.push({
                  name: toString(card.name),
                  type: toCardType(new String(card.card_type).toString()),
                  id: toString(card.id),
                } satisfies Card),
            }),
          ),
      }),
  });

  console.debug(`transformed: ${JSON.stringify(transformed)}`);

  return transformed;
};

const useCardsData = (
  animationThrowdownApi: AnimationThrowdownApi = CachedAnimationThrowdown,
): Card[] | undefined => {
  const [data, setData] = useState<Card[] | undefined>(undefined);

  useEffect(() => {
    if (!data) {
      animationThrowdownApi
        .fetchCardsData()
        .then(transformCardDataToCards)
        .then(setData)
        .catch(console.log);
    }
  }, [animationThrowdownApi, data]);

  return data;
};

export interface Hooks {
  useCardsData: typeof useCardsData;
}

export const HOOKS: Hooks = {
  useCardsData,
};
