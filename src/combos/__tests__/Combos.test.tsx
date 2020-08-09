import React from "react";
import renderer from "react-test-renderer";

import Combos from "../Combos";

describe("Combos", () => {
  test("renders as expected", () => {
    const tree = renderer.create(<Combos />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
