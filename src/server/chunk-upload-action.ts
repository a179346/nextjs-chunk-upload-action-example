'use server';

import { open, unlink } from 'fs/promises';
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

  await using fileHandle = await open(filePath, offset === 0 ? 'w' : 'r+');
  await fileHandle.write(buffer, 0, buffer.length, offset);
};

export const uploadAbortAction = async (metadata: { name: string }) => {
  const filePath = join('./uploads', metadata.name);
  await unlink(filePath);
};
