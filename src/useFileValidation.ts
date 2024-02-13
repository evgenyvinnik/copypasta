import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";

export default function useFileValidation({ accept }: DropzoneOptions) {
  const [isInvalid, setIsInvalid] = useState(false);
  const onDragOver: DropzoneOptions["onDragOver"] = (e) => {
    if (!accept) {
      return;
    }

    // if (
    //   !Array.from(e.dataTransfer.items).some((item) => accept(item.type) > -1)
    // ) {
    //   setIsInvalid(true);
    // } else {
    //   setIsInvalid(false);
    // }
    // Do something with the files
  };

  return {
    onDragOver,
    isInvalid,
  };
}
