import type { MetaFunction } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { routes } from "~/routes";
import { Webcam } from "~/components/webcam/Webcam";
import { useCallback, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { createWorker } from "tesseract.js";
import { Buildel } from "~/libs/Buildel";
import { loader } from "~/pages/home/loader.server";

export const HomePage = () => {
  const actionData = useActionData();
  const { buildelSecret, users } = useLoaderData<typeof loader>();
  const buildel = new Buildel(36, 153, buildelSecret);
  const ref = useRef<ReactWebcam>(null);
  const fetcher = useFetcher();
  const [src, setSrc] = useState<string | null | undefined>(null);
  const [text, setText] = useState("");
  const onLogout = () => {
    fetcher.submit(null, { action: routes.signOut.getPath(), method: "post" });
  };

  const getText = async () => {
    const worker = await createWorker("pol");
    const ret = await worker.recognize(
      "https://images.ctfassets.net/iltqx28aclck/nbapnItLpmV7vkzq7hoSl/527b4cbc13ad88e4a2090cf4f5fa63e7/Messenger_creation_81ad4459-bb90-4d6f-93b2-d52c49a0fa39.jpeg",
      // src!
    );
    console.log(ret.data.text);
    setText(ret.data.text);
    await worker.terminate();
  };

  const capture = useCallback(() => {
    const imageSrc = ref.current?.getScreenshot();

    console.log(imageSrc);
    setSrc(imageSrc);
  }, []);

  const startRun = async () => {
    fetcher.submit(
      { text: encodeURIComponent(text) },
      { method: "post", encType: "application/json" },
    );
  };

  console.log(actionData);

  return (
    <div>
      <button onClick={onLogout}>Logout</button>

      <h1 className="text-xl text-pink-500 mb-10">Welcome to BUDGET TRACKER</h1>

      {users.map((user) => (
        <p>{user.email}</p>
      ))}

      {/*<Webcam*/}
      {/*  ref={ref}*/}
      {/*  audio={false}*/}
      {/*  height={200}*/}
      {/*  screenshotFormat="image/jpeg"*/}
      {/*  width={600}*/}
      {/*/>*/}
      {/*<button onClick={startRun}>Start run</button>*/}

      {/*<button onClick={capture}>Capture photo</button>*/}

      {/*<button onClick={getText}>GET TEXT</button>*/}

      {/*{src && <img src={src} />}*/}

      {/*<p>{text}</p>*/}
    </div>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "BUDGET TRACKER" }];
};
