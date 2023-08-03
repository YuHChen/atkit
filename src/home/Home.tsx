import React from "react";

import Wip from "../Wip";

const Home = () => (
  <div>
    <div className="p-5 mb-4 bg-body-tertiary rounded-3">
      <h1 className="display-5">Welcome to atkit!</h1>
      <p>
        atkit is a toolkit for{" "}
        <a
          href="http://www.animationthrowdowngame.com"
          className="text-decoration-none"
        >
          Animation Throwdown: The Quest for Cards
        </a>{" "}
        game.
      </p>
    </div>

    <Wip pageName="website" />
  </div>
);

export default Home;
