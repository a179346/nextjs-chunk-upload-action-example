## nextjs-chunk-upload-action-demo

> This project serves as an example of utilizing the [nextjs-chunk-upload-action](https://github.com/a179346/nextjs-chunk-upload-action) library.

## Start

```sh
npm run dev
```

## Usage

```ts
// upload-form.tsx

'use client';

import { ChunkUploader } from 'nextjs-chunk-upload-action';

import { chunkUploadAction } from '@/server/chunk-upload-action';

export function UploadForm() {
  const handleFormAction = (formData: FormData) => {
    const file = formData.get('file') as File;
    if (!file) return;

    const uploader = new ChunkUploader({
      file,
      onChunkUpload: chunkUploadAction,
      metadata: { name: file.name },
      onChunkComplete: (bytesAccepted, bytesTotal) => {
        console.log('Progress:', `${bytesAccepted} / ${bytesTotal}`);
      },
      onError: error => {
        console.error(error);
      },
      onSuccess: () => {
        console.log('Upload complete');
      },
    });

    uploader.start();
  };

  return (
    <form className="flex flex-col items-center justify-center" action={handleFormAction}>
      <input name="file" type="file" required className="rounded-lg border-2 border-dashed p-4" />
      <button type="submit" className="mt-4 rounded-lg bg-blue-500 p-2 text-white">
        Upload
      </button>
    </form>
  );
}
```

```ts
// chunk-upload-action.ts

'use server';

import type { FileHandle } from 'fs/promises';
import { open } from 'fs/promises';
import { join } from 'path';

import type { ChunkUploadHandler } from 'nextjs-chunk-upload-action';

export const chunkUploadAction: ChunkUploadHandler<{ name: string }> = async (
  chunkFormData,
  metadata
) => {
  const blob = chunkFormData.get('blob');
  const offset = Number(chunkFormData.get('offset'));
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filePath = join('./uploads', metadata.name);

  let fileHandle: FileHandle | undefined;
  try {
    fileHandle = await open(filePath, offset === 0 ? 'w' : 'r+');
    await fileHandle.write(buffer, 0, buffer.length, offset);
  } finally {
    await fileHandle?.close();
  }
};
```
