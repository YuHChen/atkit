import React, { PropsWithChildren } from "react";
import { Alert, Spinner } from "react-bootstrap";

interface LoadingPropsBase {
  loading: boolean;
  className?: string;
}

type LoadingProps = PropsWithChildren<LoadingPropsBase>;

const Loading: React.FC<LoadingProps> = (props: LoadingProps) => {
  if (props.loading) {
    return (
      <Alert className={props.className} variant="info">
        <Spinner animation="border" role="status" size="sm" />{" "}
        <span className="mb-0">Loading...</span>
      </Alert>
    );
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Loading;
