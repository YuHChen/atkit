import { rest } from "msw";

import AnimationThrowdown from "../index";
import { server } from "../mocks/server";
import type { Api } from "../types";

describe("Animation Throwdown APIs", () => {
  beforeAll(() => server.listen());

  beforeEach(() => server.resetHandlers());

  afterAll(() => server.close());

  const errorTestHelper = (api: Api) => async () => {
    server.use(
      rest.get("*", (req, res, ctx) =>
        res(ctx.status(400), ctx.xml("<root><status>Error</status></root>")),
      ),
    );

    const actual = await api();

    expect(actual).toEqual({
      status: "Error",
    });
  };

  describe("fetchCardsData", () => {
    test(
      "given fetch fails, then transforms response and returns error JSON",
      errorTestHelper(
        AnimationThrowdown.fetchCardsData.bind(AnimationThrowdown),
      ),
    );

    test("given fetch succeeds, then transforms response and returns JSON", async () => {
      const actual = await AnimationThrowdown.fetchCardsData();

      expect(actual).toBeDefined();
      expect(actual).not.toBeNull();
      expect(typeof actual).toEqual("object");
      expect(actual).toHaveProperty("unit.id", "10076");
      expect(actual).toHaveProperty("unit.name", "Stewie");
    });
  });
});
