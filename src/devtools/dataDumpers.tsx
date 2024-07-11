import { useEffect, useState } from "react";

import { CachedAnimationThrowdown } from "../data/api";
import type { AnimationThrowdownApi, ApiResult } from "../data/api/types";
import Wip from "../Wip";

import DataDumper from "./DataDumper";

const dataHookFactory = (apiName: keyof AnimationThrowdownApi) => (
  animationThrowdownApi: AnimationThrowdownApi = CachedAnimationThrowdown
) => {
  const [data, setData] = useState<ApiResult>(undefined);

  useEffect(() => {
    if (!data) {
      animationThrowdownApi[apiName]
        .call(animationThrowdownApi)
        .then(setData)
        .catch(console.log);
    }
  }, [animationThrowdownApi, data]);

  return data;
};

const useCardsData = dataHookFactory("fetchCardsData");

const CardsDataDumper: React.FC = () => <DataDumper data={useCardsData()} />;

const CombosDataDumper: React.FC = () => (
  <Wip pageName="combos data dumper page" />
);

export { CardsDataDumper, CombosDataDumper };
