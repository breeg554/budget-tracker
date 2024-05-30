import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { RecipeScanner } from "./RecipeScanner";
import { tesseract } from "~/libs/Tesseract";
interface RecipeRetrieverProps {
  triggers: ({
    takePhoto,
    uploadPhoto,
  }: {
    takePhoto: () => void;
    uploadPhoto: () => void;
  }) => ReactNode;
}

export const RecipeRetriever: React.FC<RecipeRetrieverProps> = ({
  triggers,
}) => {
  const [image, setImage] = useState<string | File | null>(null);
  const { value: isOpen, setTrue, setFalse } = useBoolean(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (!image) return;

    const a = async () => {
      const text = await tesseract().getText(image);
      console.log(text);
    };

    a();
  }, [image]);

  const onScan = (image: string) => {
    setImage(image);
    setFalse();
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div>
      {triggers({
        takePhoto: setTrue,
        uploadPhoto: openPicker,
      })}

      <input
        type="file"
        accept="image/png, image/webp, image/jpeg"
        className="hidden"
        onChange={onUpload}
        multiple={false}
        ref={inputRef}
      />

      <RecipeScanner isOpen={isOpen} onClose={setFalse} onScan={onScan} />
    </div>
  );
};
