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
