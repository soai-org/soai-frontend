"use client";

import SigninForm from "@/components/signin/SigninForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
}
