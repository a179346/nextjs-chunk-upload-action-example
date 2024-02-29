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

import { FileHandle, open } from "fs/promises";
import { join } from "path";
import { ChunkUploadHandler } from "nextjs-chunk-upload-action";

export const chunkUploadAction: ChunkUploadHandler<{ name: string }> = async (
  chunkFormData,
  offset,
  metadata
) => {
  const blob = chunkFormData.get("blob");
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filePath = join("./uploads", metadata.name);

  let fileHandle: FileHandle | null = null;
  try {
    fileHandle = await open(filePath, offset === 0 ? "w" : "r+");
    await fileHandle.write(buffer, 0, buffer.length, offset);
  } finally {
    await fileHandle?.close();
  }
};
```
