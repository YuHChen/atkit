import React from "react";
import { Stack } from "react-bootstrap";
import { Card as CardProps } from "../data/hooks";
import Loading from "../data/Loading";
import Wip from "../Wip";
import Card from "./Card";

export interface CardsProps {
  cards?: CardProps[];
}

const Cards: React.FC<CardsProps> = ({ cards }: CardsProps) => {
  return (
    <React.Fragment>
      <Wip pageName="cards page" />
      <Loading loading={null === cards || undefined === cards}>
        <Stack gap={3}>
          {cards && cards.map((card) => <Card key={card.id} {...card} />)}
        </Stack>
      </Loading>
    </React.Fragment>
  );
};

export default Cards;
