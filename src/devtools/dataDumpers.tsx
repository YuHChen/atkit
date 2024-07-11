import { useEffect, useState } from "react";

import { CachedAnimationThrowdownApi } from "../data/api";
import type { AnimationThrowdownApi, ApiResult } from "../data/api/types";
import Wip from "../Wip";

import DataDumper from "./DataDumper";

const useCardsData = (
  api: AnimationThrowdownApi = CachedAnimationThrowdownApi
) => {
  const [cardsData, setCardsData] = useState<ApiResult>(undefined);

  useEffect(() => {
    if (!cardsData) {
      api.fetchCardsData().then(setCardsData).catch(console.log);
    }
  }, [api, cardsData]);

  return cardsData;
};

const CardsDataDumper: React.FC = () => <DataDumper data={useCardsData()} />;

const CombosDataDumper: React.FC = () => (
  <Wip pageName="combos data dumper page" />
);

export { CardsDataDumper, CombosDataDumper };
