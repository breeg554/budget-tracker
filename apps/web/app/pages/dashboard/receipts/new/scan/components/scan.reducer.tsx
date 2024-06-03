import { useEffect, useReducer, useRef } from "react";
import { BuildelRun } from "@buildel/buildel";
import { BuildelSocket } from "~/libs/BuildelSocket";
import { assert } from "~/utils/assert";
import { tesseract } from "~/libs/Tesseract";
import { CreateTransactionItemDto } from "~/api/Transaction/transactionApi.types";
import { createTransactionItemSchema } from "~/api/Transaction/transactionApi.contracts";
import { z } from "zod";

type Step = "method" | "scan" | "preview";

type Action =
  | { type: "onUpload"; payload: { image: string } }
  | { type: "scan" }
  | { type: "retrieveText"; payload: { text: string } }
  | {
      type: "retrieveItems";
      payload: { items: unknown };
    }
  | { type: "closeScan" };

interface ScanState {
  step: Step;
  image: string | null;
  recipeText: string | null;
  recipeItems: Partial<CreateTransactionItemDto>[] | null;
  error: null | string;
}

export const defaultScanState: ScanState = {
  image: null,
  recipeText: null,
  recipeItems: null,
  error: null,
  step: "method",
};

export const useScanReducer = () => {
  const buildelRef = useRef<BuildelSocket | null>(null);
  const runRef = useRef<BuildelRun | null>(null);
  const [state, dispatch] = useReducer(scanReducer, defaultScanState);

  const connectBuildel = async () => {
    buildelRef.current = new BuildelSocket(47);
    await buildelRef.current.connect();

    runRef.current = await buildelRef.current.run(151, {
      onBlockOutput: (blockId, _outputName, payload) => {
        if (blockId === "text_output_1" && hasMessageOutput(payload)) {
          dispatch({
            type: "retrieveItems",
            payload: { items: payload.message },
          });
        }
      },
    });

    await runRef.current.start();
  };

  const disconnectBuildel = async () => {
    return buildelRef.current?.disconnect();
  };
  console.log(state.recipeText);
  const sendScan = async (scan: string) => {
    assert(runRef.current, "Run not initialized");
    assert(runRef.current.status === "running", "Run is not running");
    assert(state.image, "Image not uploaded");

    const text = await tesseract().getText(scan);
    dispatch({ type: "retrieveText", payload: { text } });

    runRef.current.push("text_input_1:input", text);
  };

  const openScanner = () => {
    dispatch({ type: "scan" });
  };

  const closeScanner = () => {
    dispatch({ type: "closeScan" });
  };

  const onUpload = (image: string) => {
    dispatch({ type: "onUpload", payload: { image } });
  };

  useEffect(() => {
    if (state.step === "preview" && state.image) {
      sendScan(state.image);
    }
  }, [state.step]);

  useEffect(() => {
    connectBuildel();

    return () => {
      disconnectBuildel();
    };
  }, []);

  return {
    step: state.step,
    image: state.image,
    hasText: !!state.recipeText,
    recipeItems: state.recipeItems,
    error: state.error,
    closeScanner,
    openScanner,
    onUpload,
    onScan: onUpload,
  };
};

function scanReducer(state: ScanState, action: Action): ScanState {
  const { type } = action;

  switch (type) {
    case "onUpload":
      return {
        ...state,
        step: "preview",
        image: action.payload.image,
      };
    case "scan": {
      return {
        ...state,
        step: "scan",
      };
    }
    case "retrieveText": {
      return {
        ...state,
        recipeText: action.payload.text,
      };
    }
    case "retrieveItems": {
      const result = z
        .preprocess(
          (val) => (typeof val === "string" ? JSON.parse(val) : val),
          z.array(createTransactionItemSchema.partial()),
        )
        .safeParse(action.payload.items);

      if (result.success) {
        return {
          ...state,
          recipeItems: result.data,
        };
      }

      return {
        ...state,
        error: result.error.message,
      };
    }
    case "closeScan": {
      return {
        ...state,
        step: "method",
      };
    }
    default:
      return state;
  }
}

function hasMessageOutput(
  payload: unknown | { message: string },
): payload is { message: string } {
  return (payload as { message: string })?.message !== undefined;
}
