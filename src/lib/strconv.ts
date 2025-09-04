import type { DataSet, Element } from "dicom-parser";
import iconv from "iconv-lite";

export function getDicomString(dataset: DataSet, tag: string) {
  const element: Element | undefined = dataset.elements[tag];
  if (!element) return "";

  const bytes = new Uint8Array(
    dataset.byteArray.buffer,
    element.dataOffset,
    element.length,
  );

  const charset = dataset.string("x00080005") || "ISO_IR 6";

  if (charset.includes("192")) {
    // UTF-8
    return new TextDecoder("utf-8").decode(bytes);
  }
  if (charset.includes("149")) {
    // EUC-KR
    return iconv.decode(bytes, "euc-kr");
  }

  // fallback (ASCII 등)
  return dataset.string(tag) || "";
}

export function mapDicomCharsetToIconv(charset: string | undefined): string {
  if (!charset) {
    return "latin1"; // Default fallback if tag is missing
  }
  const upperCharset = charset.toUpperCase().replace(/ /g, "");
  if (
    upperCharset.includes("ISO2022IR149") ||
    upperCharset.includes("EUC-KR")
  ) {
    return "EUC-KR";
  }
  if (upperCharset.includes("UTF-8")) {
    return "UTF8";
  }
  // Add other mappings here if needed, e.g., for Japanese, Chinese
  if (upperCharset.includes("ISO2022IR87")) {
    return "ISO-2022-JP";
  }
  return "latin1"; // Default fallback
}
