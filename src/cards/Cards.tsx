import React from "react";
import { Stack } from "react-bootstrap";
import Wip from "../Wip";
import Card, { CardProps } from "./Card";

const cardsData = [
  { name: "obj 1", type: "object", id: "1" },
  { name: "char 1", type: "character", id: "2" },
] satisfies CardProps[];

const Cards: React.FC = () => (
  <React.Fragment>
    <Wip pageName="cards page" />
    <Stack gap={3}>
      {cardsData.map((cardData) => (
        <Card key={cardData.id} {...cardData} />
      ))}
    </Stack>
  </React.Fragment>
);

export default Cards;
