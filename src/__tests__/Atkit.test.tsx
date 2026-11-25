import { render } from "@testing-library/react";
import Atkit from "../Atkit";
import { Hooks } from "../data/hooks";

describe("Atkit", () => {
  const hooks = {
    useCardsData: () => [],
  } satisfies Hooks;

  test("renders as expected in production", () => {
    const { container } = render(<Atkit isDevo={false} hooks={hooks} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders as expected in development", () => {
    const { container } = render(<Atkit isDevo={true} hooks={hooks} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
