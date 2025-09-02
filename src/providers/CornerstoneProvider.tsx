"use client";

import { getSession, SessionContext, useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { init as csCoreInit } from "@cornerstonejs/core";
import { init as csToolInit } from "@cornerstonejs/tools";

export const CornerstoneContext = createContext(false);

export function CornerstoneProvider({ children }: { children: ReactNode }) {
  const [isInit, setInit] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const setup = async () => {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("세션이 없습니다.");
      }

      // Init libraries
      csCoreInit();
      csToolInit();
      const { init } = await import("@cornerstonejs/dicom-image-loader");
      init({
        maxWebWorkers: 1,
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
