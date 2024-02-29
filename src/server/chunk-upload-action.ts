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
