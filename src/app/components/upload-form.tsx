'use client';

import { useState } from 'react';
import type { ChunkUploaderStatus } from 'nextjs-chunk-upload-action';
import { ChunkUploader } from 'nextjs-chunk-upload-action';

import { chunkUploadAction, uploadAbortAction } from '@/server/chunk-upload-action';

export function UploadForm() {
  const [uploader, setUploader] = useState<ChunkUploader<{ name: string }> | null>(null);

  const [status, setStatus] = useState<ChunkUploaderStatus | null>(null);
  const [progress, setProgress] = useState({ bytesAccepted: 0, bytesTotal: 0 });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(null);
    setProgress({ bytesAccepted: 0, bytesTotal: file.size });
    setSuccess(false);
    setError(null);

    const uploader = new ChunkUploader({
      file,
      onChunkUpload: chunkUploadAction,
      metadata: { name: file.name },
      onAborted: uploadAbortAction,
      onStatusChange: (oldStatus, newStatus) => setStatus(newStatus),
      onChunkComplete: (bytesAccepted, bytesTotal) => setProgress({ bytesAccepted, bytesTotal }),
      onSuccess: () => setSuccess(true),
      onError: error => setError(error),
    });

    setUploader(uploader);
  };

  const handleStartClick = () => uploader?.start();
  const handlePauseClick = () => uploader?.pause();
  const handleResumeClick = () => {
    uploader?.resume();
    setError(null);
  };
  const handleAbortClick = () => uploader?.abort();

  let errorMessage = 'null';
  if (error) {
    if (error instanceof Error) errorMessage = error.message;
    else errorMessage = String(error);
  }

  return (
    <form className="flex flex-col items-center justify-center gap-4">
      <input
        name="file"
        type="file"
        className="rounded-lg border-2 border-dashed p-4"
        onChange={handleFileChange}
        disabled={status === 'uploading' || status === 'pausing' || status === 'paused'}
      />

      <div className="flex items-center gap-4">
        <button
          disabled={!uploader?.canStart}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
          onClick={handleStartClick}
        >
          Start
        </button>
        <button
          disabled={!uploader?.canPause}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
          onClick={handlePauseClick}
        >
          Pause
        </button>
        <button
          disabled={!uploader?.canResume}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
          onClick={handleResumeClick}
        >
          Resume
        </button>
        <button
          disabled={!uploader?.canAbort}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
          onClick={handleAbortClick}
        >
          Abort
        </button>
      </div>

      <div className="grid gap-4 pt-12">
        <div className="grid grid-cols-2 gap-8">
          <span className="text-right font-bold">Status</span>
          <span>{status === null ? 'null' : status}</span>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <span className="text-right font-bold">Accepted</span>
          <span>{progress.bytesAccepted} bytes</span>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <span className="text-right font-bold">Total</span>
          <span>{progress.bytesTotal} bytes</span>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <span className="text-right font-bold">Success</span>
          <span>{success ? 'Yes' : 'No'}</span>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <span className="text-right font-bold">Error</span>
          <span>{errorMessage}</span>
        </div>
      </div>
    </form>
  );
}
