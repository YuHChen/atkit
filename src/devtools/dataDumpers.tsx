import React, { useEffect, useState } from "react";
import { CachedAnimationThrowdown } from "../data/api";
import { AnimationThrowdownApi, ApiResult } from "../data/api/types";
import { Json } from "../data/types";
import DataDumper from "./DataDumper";
import { getDefinedKeys, handleJson, processJson } from "./jsonUtils";

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

const truncate = (length: number) => (data: ApiResult) =>
  processJson<Json, Json, Json, Json>(data ?? {}, {
    arrayHandler: (array) => array.toSpliced(0, array.length - length),
    objectHandler: (obj) => {
      const keys = Object.keys(obj);
      const keysSubset = keys.toSpliced(0, keys.length - length);
      const truncatedData: Json = {};
      for (const key of keysSubset) {
        truncatedData[key] = obj[key];
      }
      return truncatedData;
    },
  });

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
const useUniqueCardsData = dataHookFactory("fetchCardsData", (data) =>
  processJson(data ?? {}, {
    objectHandler: (dataObj) => {
      const uniqueKeys = new Set<string>();
      const uniqueData: Record<string, Set<Json>> = {};

      console.debug("getting unique data");
      for (const datum of Object.values(dataObj)) {
        handleJson(datum, {
          objectHandler: (datumObj) => {
            for (const key of Object.keys(datumObj)) {
              uniqueKeys.add(key);
              if (!EXCLUDED_FIELDS.includes(key)) {
                switch (key) {
                  case "skill": {
                    const skills = uniqueData[key] ?? new Set();
                    handleJson(datumObj[key], {
                      arrayHandler: (skillsArray) => {
                        for (const skill of skillsArray) {
                          handleJson(skill, {
                            objectHandler: (skillObj) =>
                              skills.add(skillObj.id),
                          });
                        }
                      },
                    });
                    uniqueData[key] = skills;
                    break;
                  }
                  case "trait": {
                    const traits = uniqueData[key] ?? new Set();
                    handleJson(datumObj[key], {
                      arrayHandler: (traitsArray) => {
                        for (const trait of traitsArray) {
                          traits.add(trait);
                        }
                      },
                    });
                    uniqueData[key] = traits;
                    break;
                  }
                  case "upgrade": {
                    const upgradeKeys = uniqueData["upgradeKeys"] ?? new Set();
                    const upgradeSkills =
                      uniqueData["upgradeSkills"] ?? new Set();
                    handleJson(datumObj[key], {
                      arrayHandler: (upgradesArray) => {
                        for (const upgrade of upgradesArray) {
                          handleJson(upgrade, {
                            objectHandler: (upgradeObj) => {
                              for (const upgradeKey of Object.keys(
                                upgradeObj,
                              )) {
                                upgradeKeys.add(upgradeKey);
                              }
                              handleJson(upgradeObj.skill, {
                                arrayHandler: (upgradeSkillsArray) => {
                                  for (const upgradeSkill of upgradeSkillsArray) {
                                    handleJson(upgradeSkill, {
                                      objectHandler: (upgradeSkillObj) =>
                                        upgradeSkills.add(upgradeSkillObj.id),
                                    });
                                  }
                                },
                              });
                            },
                          });
                        }
                      },
                    });
                    uniqueData["upgradeKeys"] = upgradeKeys;
                    uniqueData["upgradeSkills"] = upgradeSkills;
                    break;
                  }
                  default:
                    uniqueData[key] = (uniqueData[key] ?? new Set()).add(
                      datumObj[key],
                    );
                }
              }
            }
          },
        });
      }

      console.debug("transforming unique data");
      const result: Record<string, Json[]> = {};
      for (const [k, v] of Object.entries(uniqueData)) {
        result[k] = [...v];
      }
      return {
        uniqueKeys: Array.from(uniqueKeys),
        ...result,
      };
    },
  }),
);

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

  public asRecord(): Record<string, Json> {
    const nestedSchema: Record<string, Json> = {};
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
const useCardsSchemaTree = dataHookFactory("fetchCardsData", (data) =>
  processJson(data ?? {}, {
    objectHandler: (obj) => {
      console.debug("building cards schema");
      return new Schema().extract(Object.values(obj)).asRecord();
    },
  }),
);

const useCardsData = (length?: number) =>
  dataHookFactory("fetchCardsData", (data) => {
    const truncatedData = length ? truncate(length)(data) : (data ?? {});
    return processJson(truncatedData, {
      objectHandler: (obj) => Object.values(obj),
    });
  });

export const CardsDataDumper: React.FC = () => (
  <React.Fragment>
    <DataDumper data={useUniqueCardsData()} title="unique data" />
    <DataDumper data={useCardsSchemaTree()} title="cards schema tree" />
    {/* <DataDumper data={useCardsData()()} /> */}
    <DataDumper data={useCardsData(5)()} viewJson={true} />
  </React.Fragment>
);

const useCombosSummary = dataHookFactory("fetchCombosData", (data) =>
  processJson(data ?? {}, {
    arrayHandler: (array) => ({
      arrayLength: array.length,
    }),
    objectHandler: (obj) => ({
      entriesCount: Object.entries(obj).length,
    }),
  }),
);

const useCombosData = (length?: number) =>
  dataHookFactory(
    "fetchCombosData",
    length ? truncate(length) : (data) => data,
  );

export const CombosDataDumper: React.FC = () => (
  <React.Fragment>
    <DataDumper data={useCombosSummary()} title="combos summary" />
    {/* <DataDumper data={useCombosData()()} /> */}
    <DataDumper data={useCombosData(100)()} viewJson={true} />
  </React.Fragment>
);
