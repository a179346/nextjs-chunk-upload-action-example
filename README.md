## nextjs-chunk-upload-action-demo

demo [nextjs-chunk-upload-action](https://github.com/a179346/nextjs-chunk-upload-action)

## Start

```sh
npm run dev
```

## Usage

```ts
// upload-form.tsx

"use client";

import { ChunkUploader } from "nextjs-chunk-upload-action";

import { chunkUploadAction } from "@/server/chunk-upload-action";

export function UploadForm() {
  const handleFormAction = (formData: FormData) => {
    const file = formData.get("file") as File;
    if (!file) return;

    const uploader = new ChunkUploader({
      file,
      onChunkUpload: chunkUploadAction,
      metadata: { name: file.name },
      onChunkComplete: (bytesAccepted, bytesTotal) => {
        console.log("Progress:", `${bytesAccepted} / ${bytesTotal}`);
      },
      onError: (error) => {
        console.error(error);
      },
      onSuccess: () => {
        console.log("Upload complete");
      },
    });

    uploader.start();
  };

  return (
    <form
      className="flex flex-col items-center justify-center"
      action={handleFormAction}
    >
      <input
        name="file"
        type="file"
        className="p-4 border-2 border-dashed rounded-lg"
      />
      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
      >
        Upload
      </button>
    </form>
  );
}
```

```ts
// chunk-upload-action.ts

"use server";

import { createWriteStream } from "fs";
import { join } from "path";

export async function chunkUploadAction(
  base64Chunk: string,
  offset: number,
  metadata: { name: string }
) {
  const buffer = Buffer.from(base64Chunk, "base64");
  const path = join("./uploads", metadata.name);

  const writeable = createWriteStream(
    path,
    offset === 0
      ? { flags: "w" }
      : {
          flags: "r+",
          start: offset,
        }
  );

  return new Promise<void>((resolve, reject) => {
    writeable.on("finish", () => resolve());
    writeable.on("error", reject);
    writeable.write(buffer);
    writeable.end();
  });
}
```
