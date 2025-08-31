import Image from "next/image";

interface ThumbnailByArrayProps {
  imgByteString: number[];
}

export function ThumbnailByArray({ imgByteString }: ThumbnailByArrayProps) {
  // byte array 형태로 반환되었을 때 변환방법
  const byteArray = new Uint8Array(imgByteString);
  const blob = new Blob([byteArray], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  return <Image src={url} alt="thumbnail" width={500} height={500} />;
}

interface ThumbnailByBase64Props {
  imgBase64: string;
}

export function ThumbnailByBase64({ imgBase64 }: ThumbnailByBase64Props) {
  return <Image src={imgBase64} alt="thumbnail" width={500} height={500} />;
}
