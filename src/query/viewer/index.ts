import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/query/axios";
import { getSession } from "next-auth/react";
import { SeriesCard } from "@/types/viewer/series";
import { Pagination } from "@/types/pagination";
import dicomParser from "dicom-parser";

const path = "/api/viewer";

const paths = {
  series: path + "/serieslist",
  dicomfile: path + "/dicomfile",
};

export function useSeriesByStudyUUID({
  studyUuid,
}: { studyUuid: string } & Pagination) {
  return useQuery({
    queryKey: [paths.series, studyUuid],
    queryFn: async () => {
      const data: { studyUuid: string } = {
        studyUuid,
      };

      const session = await getSession();
      if (!session?.accessToken) return [];

      try {
        const res = await axios.post<SeriesCard[]>(`${paths.series}`, data, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });
}

export function useSeriesByStudyUUIDinMutation() {
  return useMutation({
    mutationFn: async ({ studyUuid }: { studyUuid: string } & Pagination) => {
      const data: { studyUuid: string } = {
        studyUuid,
      };

      const session = await getSession();
      if (!session?.accessToken) return [];

      try {
        const res = await axios.post<SeriesCard[]>(`${paths.series}`, data, {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });
}

export function useDicomFile() {
  return useMutation({
    mutationFn: requestDicomfile,
  });
}

export async function requestDicomfile(instanceUuid: string) {
  const data = {
    instanceUuid,
  };

  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("세션이 없습니다.");
  }

  try {
    const res = await axios.post(`${paths.dicomfile}`, data, {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    const arraybuffer: ArrayBuffer = res.data;
    const byteArray = new Uint8Array(arraybuffer);

    const option = { TransferSyntaxUID: "1.2.840.10008.1.2.1" };
    const dataset = dicomParser.parseDicom(byteArray, option);

    const pixelDataElement = dataset.elements["x7fe00010"];

    const pixelData = new Uint16Array(
      dataset.byteArray.buffer,
      pixelDataElement.dataOffset,
      pixelDataElement.length / 2,
    );

    return pixelData;
  } catch (error) {
    throw new Error("파일을 불러오는데 실패했습니다.");
  }
}

export function loadImageSpring(instanceUuid: string) {
  let abortController: AbortController | undefined = new AbortController();

  const loadPromise = async (): Promise<Record<string, unknown>> => {
    const data = {
      instanceUuid: instanceUuid.replace("spring:", ""),
    };

    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("세션이 없습니다.");
    }

    try {
      const res = await axios.post(`/api/viewer/dicomfile`, data, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          // "Content-Type": "application/dicom",
        },
        signal: abortController?.signal,
      });

      const image = convertToImage(instanceUuid, res.data);
      // const byteArray = new Uint8Array(res.data);
      // const dataSet = dicomParser.parseDicom(byteArray);
      // const pixelDataElement = dataSet.elements.x7fe00010;
      // const pixelData = new Uint8Array(
      //   dataSet.byteArray.buffer,
      //   pixelDataElement.dataOffset,
      //   pixelDataElement.length,
      // ) as dicomParser.ByteArray;

      // const image = {
      //   imageId: instanceUuid,
      //   rows: 512,
      //   columns: 512,
      //   getPixelData: () => pixelData,
      //   minPixelValue: 0,
      //   maxPixelValue: 4095,
      //   windowCenter: 2048,
      //   windowWidth: 4096,
      //   sizeInBytes: pixelData.byteLength,
      // };

      // 픽셀 데이터 추출
      // const image = createImage(
      //   instanceUuid,
      //   pixelData,
      //   "1.2.840.10008.1.2.1",
      // ) as Record<string, unknown>;
      return image;
    } catch (error) {
      console.log(error);
      throw new Error("파일을 불러오는데 실패했습니다.");
    }
  };

  return {
    promise: loadPromise(),
    cancelFn: () => {
      if (abortController) {
        abortController.abort();
      }
    },
    decache: () => {
      abortController = undefined;
    },
  };
}
