import React, { ReactNode, useState } from 'react';
import ReactWebcam, { WebcamProps } from 'react-webcam';

const videoConstraints: MediaStreamConstraints['video'] = {
  facingMode: 'environment',
};

export const Webcam = React.forwardRef<
  ReactWebcam,
  Partial<Omit<WebcamProps, 'children'> & { children: ReactNode }>
>(({ onUserMediaError, children, ...props }, ref) => {
  const [error, setError] = useState<string | DOMException | null>(null);

  const handleOnUserMediaError = (error: string | DOMException) => {
    console.error(error);
    setError(error);
    onUserMediaError?.(error);
  };

  if (error) {
    return <p>Ups...{JSON.stringify(error)}</p>;
  }

  return (
    <>
      <ReactWebcam
        ref={ref}
        audio={false}
        videoConstraints={videoConstraints}
        onUserMediaError={handleOnUserMediaError}
        screenshotQuality={1}
        {...props}
      />
      {children}
    </>
  );
});
