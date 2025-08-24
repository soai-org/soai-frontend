import React, { useEffect, useRef } from "react";

import {
  RenderingEngine,
  Enums,
  imageLoader,
  StackViewport,
  init as csCoreInit,
} from "@cornerstonejs/core";
import { init as csToolInit } from "@cornerstonejs/tools";

// import dicomImageLoader from "@cornerstonejs/dicom-image-loader";
import { PublicViewportInput } from "@cornerstonejs/core/types";
import axios from "axios";

async function loadDCMFile(): Promise<ArrayBuffer> {
  try {
    const response = await axios.get("/dummy.dcm", {
      responseType: "arraybuffer",
    });

    return response.data;
  } catch (error) {
    console.log("DCM 파일을 불러오는 데 실패했습니다.", error);

    return new ArrayBuffer(0);
  }
}

const DicomViewer = () => {
  const viewerElement = useRef<HTMLDivElement>(null);
  const cornerstoneDICOMImageLoader = useRef<unknown>(null);

  useEffect(() => {
    const setup = async () => {
      if (window.document && viewerElement.current) {
        csCoreInit();
        csToolInit();

        // cornerstonejs/dicom-image-loader를 다이나믹하게 import
        const dicomImageLoaderModule = await import(
          "@cornerstonejs/dicom-image-loader"
        );
        dicomImageLoaderModule.init({
          maxWebWorkers: 1,
        });

        cornerstoneDICOMImageLoader.current = dicomImageLoaderModule;
        console.log(cornerstoneDICOMImageLoader.current);

        const dcmFile = await loadDCMFile();

        const renderingEngineId = "viewerEngine";
        const renderingEngine = new RenderingEngine(renderingEngineId);

        const viewportId = "MEDICAL_IMAGE_VIEWER";

        const viewportInput: PublicViewportInput = {
          viewportId,
          element: viewerElement.current,
          type: Enums.ViewportType.ORTHOGRAPHIC,
        };

        renderingEngine.enableElement(viewportInput);

        const viewport = renderingEngine.getViewport(viewportId);
        viewport.render();
      }
    };

    setup();
  }, [viewerElement]);

  return (
    <div
      ref={viewerElement}
      style={{
        width: "512px",
        height: "512px",
        backgroundColor: "#000",
      }}
    ></div>
  );
};

export default DicomViewer;
