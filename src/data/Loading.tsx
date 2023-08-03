import React, { PropsWithChildren } from "react";
import Alert from "react-bootstrap/Alert";

interface LoadingPropsBase {
  loading: boolean;
  className?: string;
}

type LoadingProps = PropsWithChildren<LoadingPropsBase>;

const Loading: React.FC<LoadingProps> = (
  props: LoadingProps
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
