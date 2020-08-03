import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";

import Wip from "../Wip";

const Home = () => (
  <div>
    <Jumbotron className="mt-3">
      <h1>Welcome to atkit!</h1>
      <p>
        atkit is a toolkit for{" "}
        <a href="http://www.animationthrowdowngame.com">
          Animation Throwdown: The Quest for Cards
        </a>{" "}
        game.
      </p>
    </Jumbotron>

    <Wip pageName="website" />
  </div>
);

export default Home;
