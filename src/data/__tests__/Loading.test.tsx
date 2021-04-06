import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import Loading from "../Loading";

describe("Loading", () => {
  test("renders loading message given loading prop", () => {
    const shouldNotBeDisplayed = "Should not be displayed on screen";

    render(
      <Loading loading={true}>
        <p>{shouldNotBeDisplayed}</p>
      </Loading>
    );
    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/loading/i);

    const text = screen.queryByText(shouldNotBeDisplayed);

    expect(text).toBeNull();
  });

  test("renders component given loading completed prop", () => {
    const shouldBeDisplayed = "Should be displayed on screen";

    render(
      <Loading loading={false}>
        <p>{shouldBeDisplayed}</p>
      </Loading>
    );
    const text = screen.getByText(shouldBeDisplayed);

    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent(/should be displayed/i);
  });
});
