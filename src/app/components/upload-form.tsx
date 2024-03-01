'use client';

import { useState } from 'react';
import { ChunkUploader } from 'nextjs-chunk-upload-action';

import { chunkUploadAction } from '@/server/chunk-upload-action';

export function UploadForm() {
  const [progress, setProgress] = useState<{
    bytesAccepted: number;
    bytesTotal: number;
  } | null>(null);

  const handleFormAction = (formData: FormData) => {
    const file = formData.get('file') as File;
    if (!file) return;

    const uploader = new ChunkUploader({
      file,
      onChunkUpload: chunkUploadAction,
      metadata: { name: file.name },
      onChunkComplete: (bytesAccepted, bytesTotal) => setProgress({ bytesAccepted, bytesTotal }),
      onError: () => setProgress(null),
      onSuccess: () => setProgress(null),
    });

    setProgress({ bytesAccepted: 0, bytesTotal: file.size });
    uploader.start();
  };

  const percentage = progress
    ? Math.round((progress.bytesAccepted / progress.bytesTotal) * 100)
    : 0;

  return (
    <form className="flex flex-col items-center justify-center" action={handleFormAction}>
      <input name="file" type="file" required className="rounded-lg border-2 border-dashed p-4" />
      <button
        type="submit"
        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
        disabled={progress !== null}
      >
        {progress ? `${percentage} %` : 'Upload'}
      </button>
    </form>
  );
}
