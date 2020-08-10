import React from "react";
import Alert from "react-bootstrap/Alert";
import { useLocation } from "react-router-dom";

type NoMatchProps = {
  className?: string;
};

const NoMatch = (props: NoMatchProps) => (
  <Alert className={props.className} variant="danger">
    <Alert.Heading>Not Found</Alert.Heading>
    <p className="mb-0">
      Sorry, we couldn't find <code>{useLocation().pathname}</code>.
    </p>
  </Alert>
);

export default NoMatch;
