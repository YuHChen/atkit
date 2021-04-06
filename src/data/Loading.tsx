import React, { PropsWithChildren } from "react";
import Alert from "react-bootstrap/Alert";

interface LoadingProps {
  loading: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = (
  props: PropsWithChildren<LoadingProps>
) => {
  if (props.loading) {
    return (
      <Alert className={props.className} variant="info">
        <p className="mb-0">Loading...</p>
      </Alert>
    );
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Loading;
