import Compressor from "compressorjs";

export const compressImage = (
  file: File | Blob,
  onSuccess: Compressor.Options["success"]
) => {
  new Compressor(file, {
    quality: 0.8,
    success: onSuccess,
  });
};
