"use client";

import { getSession, useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";
import { init as csCoreInit, metaData } from "@cornerstonejs/core";
import { init as csToolInit } from "@cornerstonejs/tools";

export const CornerstoneContext = createContext(false);

metaData.addProvider((type) => {
  if (type === "imagePlaneModule") {
    return {
      imageOrientationPatient: [1, 0, 0, 0, 1, 0],
    };
  }

  return undefined;
});

export function CornerstoneProvider({ children }: { children: ReactNode }) {
  const [isInit, setInit] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const setup = async () => {
      const session = await getSession();
      if (!session?.accessToken) {
        console.log("세션이 없습니다.");
        return;
      }

      // Init libraries
      csCoreInit();
      csToolInit();
      const { init: csImageLoaderInit } = await import(
        "@cornerstonejs/dicom-image-loader"
      );
      csImageLoaderInit({
        beforeSend(xhr) {
          xhr.setRequestHeader(
            "Authorization",
            `Bearer ${session.accessToken}`,
          );
        },
      });
    };

    if (!isInit) {
      setup().then(() => setInit(true));
    }
  }, [isInit, status]);

  return <CornerstoneContext value={isInit}>{children}</CornerstoneContext>;
}
