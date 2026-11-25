import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Card as CardProps } from "../data/hooks";

export type CardRenderProps = CardProps;

const AtCard: React.FC<CardRenderProps> = ({
  name,
  type,
  id,
}: CardRenderProps) => (
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

export default AtCard;
