import React from "react";
import { ListGroup, ListGroupItem, Card } from "react-bootstrap";

type CardType = "character" | "object" | "power";

interface CardProps {
  // primary props (card face)
  name: string;

  // secondary props (additional details)
  type: CardType;

  // meta props
  id: string;
}

const AtCard: React.FC<CardProps> = ({ name, type, id }: CardProps) => (
  <Card border="secondary" as="article" aria-label={name}>
    <Card.Header>{name}</Card.Header>
    <ListGroup variant="flush">
      <ListGroupItem>
        Additional Details
        <ul className="mb-0">
          <li>type: {type}</li>
        </ul>
      </ListGroupItem>
      <ListGroupItem>
        Metadata
        <ul className="mb-0">
          <li>id: {id}</li>
        </ul>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

export type { CardProps };

export { AtCard as default };
