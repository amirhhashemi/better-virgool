import { useState, useEffect } from "react";

type ReadAsMethod =
  | "readAsText"
  | "readAsDataURL"
  | "readAsArrayBuffer"
  | "readAsBinaryString";

interface UseFileReaderProps {
  method?: ReadAsMethod;
  onLoad?: (result: unknown, file?: File) => Promise<void>;
  onError?: (result: ProgressEvent<FileReader>) => void;
}

export const useFileReader = ({
  method = "readAsDataURL",
  onLoad,
  onError,
}: UseFileReaderProps = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DOMException | null>(null);
  const [result, setResult] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (!file) {
      setFile(null);
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = () => setLoading(true);
    reader.onloadend = () => setLoading(false);
    reader.onerror = (e) => {
      setError(reader.error);
      if (onError) {
        onError(e);
      }
    };

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      setResult(e.target?.result ?? null);
      if (onLoad) {
        await onLoad(e.target?.result ?? null, file);
      }
    };

    reader[method](file);
  }, [file, method]);

  return { file, error, loading, result, setFile };
};
