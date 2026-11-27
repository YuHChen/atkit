import { renderHook, waitFor } from "@testing-library/react";
import { AnimationThrowdownApi, ApiResult } from "../api/types";
import { Hooks, HOOKS } from "../hooks";

describe("hooks", () => {
  describe("useCardsData", () => {
    const mockFetchCardsData = vi.fn();
    const api = {
      fetchCardsData: mockFetchCardsData,
      fetchCombosData: () => Promise.reject(new Error("should not be called")),
    } satisfies AnimationThrowdownApi;

    const useCardsDataTestHelper = async (
      mockValue: ApiResult,
      expectations: (r: ReturnType<Hooks["useCardsData"]>) => void,
    ) => {
      mockFetchCardsData.mockResolvedValueOnce(mockValue);

      const { result } = renderHook(HOOKS.useCardsData, { initialProps: api });

      // intially undefined while loading
      expect(result.current).toBeUndefined();

      // wait for async updates
      await waitFor(() => {
        expect(result.current).not.toBeUndefined();
      });
      expectations(result.current);
    };

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    test("returns empty data given unexpected response shapes", async () => {
      const checkEmpty = (actual: ReturnType<Hooks["useCardsData"]>) =>
        expect(actual).toHaveLength(0);

      await useCardsDataTestHelper(undefined, checkEmpty);
      await useCardsDataTestHelper(["unexpected"], checkEmpty);
      await useCardsDataTestHelper({ test: "unexpected" }, checkEmpty);
      await useCardsDataTestHelper({ test: ["unexpected"] }, checkEmpty);
    });

    test("returns transformed data given expected response shape", async () => {
      await useCardsDataTestHelper(
        {
          "0": {},
          "1": {
            name: "test",
            card_type: "character",
            id: "1",
          },
        },
        (actual) => {
          expect(actual).toStrictEqual([
            {
              name: "undefined",
              type: "unknown",
              id: "undefined",
            },
            {
              name: "test",
              type: "character",
              id: "1",
            },
          ]);
        },
      );
    });
  });
});
