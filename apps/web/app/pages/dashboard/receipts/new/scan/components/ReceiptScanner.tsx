import React, { PropsWithChildren } from "react";
import { Webcam } from "~/components/webcam/Webcam";
import ReactWebcam from "react-webcam";
import { IconButton } from "~/buttons/IconButton";
import { Cross2Icon, ReloadIcon } from "@radix-ui/react-icons";
import { assert } from "~/utils/assert";
import { Button } from "~/buttons/Button";

interface ReceiptScannerProps {
  onScan: (image: string) => void;
  onClose: () => void;
}

export const ReceiptScanner: React.FC<
  PropsWithChildren<ReceiptScannerProps>
> = ({ onClose, onScan }) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black">
      <ScannerModal onScreenshot={onScan} />

      <IconButton
        size="4"
        type="button"
        className="absolute top-2 right-2"
        variant="soft"
        radius="full"
        color="sky"
        onClick={onClose}
      >
        <Cross2Icon width={24} height={24} />
      </IconButton>
    </div>
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
          type="button"
          radius="full"
          size="4"
          className="cursor-pointer bg-white text-neutral-900"
          variant="solid"
          onClick={onRetry}
        >
          <ReloadIcon />
        </IconButton>

        <Button onClick={onSave} type="button" size="3" variant="solid">
          Save
        </Button>
      </div>
    </div>
  );
}
