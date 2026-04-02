import React, { useEffect, useState } from "react";

import { CachedAnimationThrowdown } from "../data/api";
import type { AnimationThrowdownApi, ApiResult } from "../data/api/types";

import DataDumper from "./DataDumper";
import { getDefinedKeys, handleJson } from "./jsonUtils";
import { Json } from "./types";

const dataHookFactory =
  (
    apiName: keyof AnimationThrowdownApi,
    transform: (r: ApiResult) => ApiResult = (r) => r,
  ) =>
  (animationThrowdownApi: AnimationThrowdownApi = CachedAnimationThrowdown) => {
    const [data, setData] = useState<ApiResult>(undefined);

    useEffect(() => {
      if (!data) {
        animationThrowdownApi[apiName]
          .call(animationThrowdownApi)
          .then(transform)
          .then(setData)
          .catch(console.log);
      }
    }, [animationThrowdownApi, data]);

    return data;
  };

const truncate = (length: number) => (data: ApiResult) => {
  if (Array.isArray(data)) {
    return data.toSpliced(0, data.length - length);
  } else if (typeof data === "object") {
    const keys = Object.keys(data);
    const keysSubset = keys.toSpliced(0, keys.length - length);
    const truncatedData: { [k: string]: any } = {};
    for (const key of keysSubset) {
      truncatedData[key] = data[key];
    }
    return truncatedData;
  } else {
    return data;
  }
};

const EXCLUDED_FIELDS = [
  "attack",
  "asset_bundle",
  "character_bust_asset_bundle",
  "combo_card_id",
  "defense_card_id",
  "desc",
  "fight_pose_asset",
  "fight_pose_asset_flipped",
  "health",
  "id",
  "item_bundle_id",
  "item_desc",
  "item_name",
  "item_prefab",
  "item_prefab_large",
  "linked_card_id",
  "name",
  "picture",
  "power",
  "release_time",
];
const useUniqueCardsData = dataHookFactory("fetchCardsData", (data) => {
  if (typeof data === "object") {
    const uniqueKeys = new Set<string>();
    const uniqueData: Record<string, Set<any>> = {};

    console.debug("getting unique data");
    for (const datum of Object.values(data)) {
      for (const key of Object.keys(datum)) {
        uniqueKeys.add(key);
        if (!EXCLUDED_FIELDS.includes(key)) {
          switch (key) {
            case "skill":
              const skills = uniqueData[key] ?? new Set();
              for (const skill of datum[key]) {
                skills.add(skill.id);
              }
              uniqueData[key] = skills;
              break;
            case "trait":
              const traits = uniqueData[key] ?? new Set();
              for (const trait of datum[key]) {
                traits.add(trait);
              }
              uniqueData[key] = traits;
              break;
            case "upgrade":
              const upgradeKeys = uniqueData["upgradeKeys"] ?? new Set();
              const upgradeSkills = uniqueData["upgradeSkills"] ?? new Set();
              for (const upgrade of datum[key]) {
                for (const upgradeKey of Object.keys(upgrade)) {
                  upgradeKeys.add(upgradeKey);
                }
                for (const upgradeSkill of upgrade.skill ?? []) {
                  upgradeSkills.add(upgradeSkill.id);
                }
              }
              uniqueData["upgradeKeys"] = upgradeKeys;
              uniqueData["upgradeSkills"] = upgradeSkills;
              break;
            default:
              uniqueData[key] = (uniqueData[key] ?? new Set()).add(datum[key]);
          }
        }
      }
    }

    console.debug("transforming unique data");
    const result: Record<string, any[]> = {};
    for (const [k, v] of Object.entries(uniqueData)) {
      result[k] = [...v];
    }
    return {
      uniqueKeys: Array.from(uniqueKeys),
      ...result,
    };
  } else {
    return data;
  }
});

class Schema {
  private keyCount: number = 0;
  private instances: number = 0;
  private nestedSchema: Map<string, Schema> = new Map();

  public increment(): this {
    this.keyCount++;
    return this;
  }

  public extract(data: Json): this {
    handleJson(data, {
      nullHandler: () => {},
      primativeHandler: () => {},
      arrayHandler: (array) => {
        this.instances += array.length;
        const arraySchema =
          this.nestedSchema.get("arrayElement") ?? new Schema();
        for (const e of array) {
          arraySchema.extract(e);
        }
        this.nestedSchema.set("arrayElement", arraySchema);
      },
      objectHandler: (obj) => {
        for (const key of getDefinedKeys(obj)) {
          const keySchema = this.nestedSchema.get(key) ?? new Schema();
          this.nestedSchema.set(key, keySchema.increment().extract(obj[key]));
        }
      },
    });
    return this;
  }

  public asRecord(): Record<string, any> {
    const nestedSchema: Record<string, any> = {};
    for (const [key, schema] of this.nestedSchema.entries()) {
      if (key === "arrayElement") {
        return {
          ...schema.asRecord(),
          keyCount: this.keyCount,
          instances: this.instances,
        };
      } else {
        nestedSchema[key] = schema.asRecord();
      }
    }

    return {
      keyCount: this.keyCount,
      instances: this.instances,
      ...nestedSchema,
    };
  }
}
const useCardsSchemaTree = dataHookFactory("fetchCardsData", (data) => {
  if (typeof data === "object") {
    console.debug("building cards schema");
    return new Schema().extract(Object.values(data)).asRecord();
  } else {
    return data;
  }
});

const useCardsData = (length?: number) =>
  dataHookFactory("fetchCardsData", (data) => {
    const truncatedData = length ? truncate(length)(data) : data;
    if (typeof truncatedData === "object") {
      return Object.values(truncatedData);
    } else {
      return truncatedData;
    }
  });

const CardsDataDumper: React.FC = () => (
  <React.Fragment>
    <DataDumper data={useUniqueCardsData()} title="unique data" />
    <DataDumper data={useCardsSchemaTree()} title="cards schema tree" />
    {/* <DataDumper data={useCardsData()()} /> */}
    <DataDumper data={useCardsData(5)()} viewJson={true} />
  </React.Fragment>
);

const useCombosSummary = dataHookFactory("fetchCombosData", (data) => {
  if (Array.isArray(data)) {
    return {
      arrayLength: data.length,
    };
  } else if (typeof data === "object") {
    return {
      entriesCount: Object.entries(data).length,
    };
  } else {
    return data;
  }
});

const useCombosData = (length?: number) =>
  dataHookFactory(
    "fetchCombosData",
    length ? truncate(length) : (data) => data,
  );

const CombosDataDumper: React.FC = () => (
  <React.Fragment>
    <DataDumper data={useCombosSummary()} title="combos summary" />
    {/* <DataDumper data={useCombosData()()} /> */}
    <DataDumper data={useCombosData(100)()} viewJson={true} />
  </React.Fragment>
);

export { CardsDataDumper, CombosDataDumper };
