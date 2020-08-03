import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Cards from "./cards/Cards";
import Combos from "./combos/Combos";
import ComboMap from "./deck/ComboMap";
import Home from "./home/Home";

import logo from "./assets/logo.png";

const Logo = () => (
  <LinkContainer to="/">
    <Navbar.Brand>
      <img
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="atkit logo"
      />
    </Navbar.Brand>
  </LinkContainer>
);

const NavBar = () => (
  <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" sticky="top">
    <Logo />

    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      {/* Set activeKey="/" to mark nav links as inactive when on home page*/}
      <Nav variant="pills" activeKey="/">
        <LinkContainer to="/cards">
          <Nav.Link>Cards</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/combos">
          <Nav.Link>Combos</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/combomap">
          <Nav.Link>Combo Map</Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const Atkit = () => (
  <Router>
    <div className="atkit">
      <NavBar />

      <Container>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/cards">
            <Cards />
          </Route>
          <Route path="/combos">
            <Combos />
          </Route>
          <Route path="/combomap">
            <ComboMap />
          </Route>
        </Switch>
      </Container>
    </div>
  </Router>
);

export default Atkit;
