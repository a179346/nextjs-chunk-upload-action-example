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
