import type { MetaFunction } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { routes } from "~/routes";
import { Webcam } from "~/components/webcam/Webcam";
import { useCallback, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { createWorker } from "tesseract.js";
import { Buildel } from "~/libs/Buildel";
import { loader } from "./loader.server";
import { Button, IconButton } from "@radix-ui/themes";
import { SectionWrapper } from "~/layout/SectionWrapper";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export const DashboardPage = () => {
  const actionData = useActionData();
  const { buildelSecret } = useLoaderData<typeof loader>();
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

  return (
    <>
      <SectionWrapper className="mb-6 mt-10 flex gap-2 items-center justify-between">
        <h1 className="text-4xl text-neutral-900">
          <span className="block">Hello,</span>{" "}
          <span className="block font-bold">Dawid</span>
        </h1>

        <button className="rounded-full border border-neutral-150 w-12 h-12 bg-transparent flex justify-center items-center">
          <MagnifyingGlassIcon width={20} height={20} />
        </button>
      </SectionWrapper>

      <SectionWrapper className="mb-6">
        <div className="bg-primary-900 w-full h-[200px] rounded-3xl" />
      </SectionWrapper>

      <SectionWrapper>
        <header className="flex gap-2 justify-between items-center mb-2">
          <h2 className="text-neutral-900">Spending</h2>

          <p>select</p>
        </header>

        <ul>
          <li className="flex justify-between">
            <span>element 1</span> <span>-100</span>
          </li>
        </ul>
      </SectionWrapper>
      <button onClick={onLogout}>Logout</button>

      {/*{users.map((user) => (*/}
      {/*  <p>{user.email}</p>*/}
      {/*))}*/}

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
    </>
  );
};

export const meta: MetaFunction = () => {
  return [{ title: "BUDGET TRACKER" }];
};
