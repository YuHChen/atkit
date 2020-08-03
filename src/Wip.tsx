import React from "react";
import Alert from "react-bootstrap/Alert";

type WipProps = {
  className?: string;
  pageName: string;
};

const Wip = (props: WipProps) => (
  <Alert className={props.className} variant="info">
    <Alert.Heading>Pardon the mess</Alert.Heading>
    <p className="mb-0">This {props.pageName} is still a work in progress.</p>
  </Alert>
);

export default Wip;
