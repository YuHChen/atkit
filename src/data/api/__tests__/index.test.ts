import { HttpResponse, http } from "msw";

import AnimationThrowdown from "../index";
import { server } from "../mocks/server";
import type { AnimationThrowdownApi, Api, ApiResult } from "../types";

describe("Animation Throwdown APIs", () => {
  beforeAll(() => server.listen());

  beforeEach(() => server.resetHandlers());

  afterAll(() => server.close());

  const errorTestHelper = (api: Api) => async () => {
    server.use(
      http.get("*", () =>
        HttpResponse.xml("<root><status>Error</status></root>", {
          status: 400,
        }),
      ),
    );

    const actual = await api();

    expect(actual).toEqual({
      status: "Error",
    });
  };

  type ApiTestParams = {
    apiName: keyof AnimationThrowdownApi;
    expectations: (actual: ApiResult) => void;
  };

  const fetchCardsDataExpectations = (actual: ApiResult) => {
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(typeof actual).toEqual("object");
    expect(actual).toHaveProperty("unit.id", "10076");
    expect(actual).toHaveProperty("unit.name", "Stewie");
  };

  const fetchCombosDataExpectations = (actual: ApiResult) => {
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(typeof actual).toEqual("object");
    expect(actual).toHaveProperty("combo.card_id", "15178");
    expect(actual).toHaveProperty("combo.cards", {
      __attr__: {
        card1: "10009",
        card2: "10051",
      },
    });
  };

  describe.each`
    apiName              | expectations
    ${"fetchCardsData"}  | ${fetchCardsDataExpectations}
    ${"fetchCombosData"} | ${fetchCombosDataExpectations}
  `(
    "$apiName",
    ({ apiName, expectations: checkExpectations }: ApiTestParams) => {
      test(
        "given fetch fails, then transforms response and returns error JSON",
        errorTestHelper(AnimationThrowdown[apiName].bind(AnimationThrowdown)),
      );

      test("given fetch succeeds, then transforms response and returns JSON", async () => {
        const actual =
          await AnimationThrowdown[apiName].call(AnimationThrowdown);
        checkExpectations(actual);
      });
    },
  );
});
