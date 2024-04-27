import React from "react";
import ReactWebcam, { WebcamProps } from "react-webcam";

export const Webcam = React.forwardRef<ReactWebcam, WebcamProps>(
  (props, ref) => {
    return <ReactWebcam ref={ref} {...props} />;
  }
);
