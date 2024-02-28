"use server";

import { FileHandle, open } from "fs/promises";
import { join } from "path";

export async function chunkUploadAction(
  base64Chunk: string,
  offset: number,
  metadata: { name: string }
) {
  const buffer = Buffer.from(base64Chunk, "base64");
  const filePath = join("./uploads", metadata.name);

  let fileHandle: FileHandle | null = null;
  try {
    fileHandle = await open(filePath, offset === 0 ? "w" : "r+");
    await fileHandle.write(buffer, 0, buffer.length, offset);
  } finally {
    await fileHandle?.close();
  }
}
