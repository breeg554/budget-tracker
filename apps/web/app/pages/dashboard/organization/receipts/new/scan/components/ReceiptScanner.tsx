import React, { PropsWithChildren } from 'react';
import ReactWebcam from 'react-webcam';

import { Button } from '~/buttons/Button';
import { IconButton } from '~/buttons/IconButton';
import { Webcam } from '~/components/webcam/Webcam';
import { CrossIcon } from '~/icons/CrossIcon';
import { ReloadIcon } from '~/icons/ReloadIcon';
import { DialogPortal } from '~/ui/dialog';
import { assert } from '~/utils/assert';
import { base64ToFile } from '~/utils/file';

interface ReceiptScannerProps {
  onScan: (file: File) => void;
  onClose: () => void;
}

export const ReceiptScanner: React.FC<
  PropsWithChildren<ReceiptScannerProps>
> = ({ onClose, onScan }) => {
  const onScreenshot = (src: string) => {
    const file = base64ToFile(src.split(',')[1], 'receipt.jpeg', 'image/jpeg');
    onScan(file);
  };

  return (
    <DialogPortal>
      <div className="fixed top-0 bottom-0 left-0 right-0 z-[120] bg-black pointer-events-auto">
        <ScannerModal onScreenshot={onScreenshot} />

        <IconButton
          type="button"
          size="xxs"
          className="absolute top-2 right-2 z-[101]"
          variant="outline"
          onClick={onClose}
          icon={<CrossIcon />}
        />
      </div>
    </DialogPortal>
  );
};

interface ScannerModalProps {
  onScreenshot: (image: string) => void;
}

function ScannerModal({ onScreenshot }: ScannerModalProps) {
  const webcamRef = React.useRef<ReactWebcam>(null);
  const [screenshot, setScreenshot] = React.useState<string | null | undefined>(
    null,
  );

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setScreenshot(imageSrc);
  };

  const onSave = () => {
    assert(screenshot);

    onScreenshot(screenshot);
  };

  const onRetry = () => {
    setScreenshot(null);
  };

  if (screenshot)
    return <Preview src={screenshot} onRetry={onRetry} onSave={onSave} />;

  return (
    <div className="relative w-full h-full">
      <Webcam className="h-screen w-auto mx-auto" ref={webcamRef}>
        <button
          type="button"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border-4 border-white w-12 h-12 hover:scale-110 transition"
          onClick={capture}
        />
      </Webcam>

      {screenshot && <img src={screenshot} alt="Screenshot" />}
    </div>
  );
}

interface PreviewProps {
  src: string;
  onRetry: () => void;
  onSave: () => void;
}
function Preview({ src, onRetry, onSave }: PreviewProps) {
  return (
    <div>
      <img
        src={src}
        alt="Image preview"
        className="w-auto object-contain h-screen mx-auto"
      />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 items-center">
        <IconButton
          variant="outline"
          type="button"
          onClick={onRetry}
          icon={<ReloadIcon />}
        />

        <Button onClick={onSave} type="button">
          Save
        </Button>
      </div>
    </div>
  );
}
