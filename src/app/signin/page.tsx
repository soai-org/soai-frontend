"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const params = useSearchParams();

  const [failed, setFailed] = useState(false);

  const handleLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    if (params.has("error")) {
      setFailed(true);
    }
  }, [params, setFailed]);

  return (
    <main className="flex items-center bg-background justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">로그인</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">ID</Label>
            <Input
              className={cn(failed && "border-red-500")}
              id="id"
              type="string"
              placeholder="ID를 입력하세요."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">패스워드</Label>
            <Input
              className={cn(failed && "border-red-500")}
              id="password"
              type="password"
              placeholder="*******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="min-h-[10px]">
            {failed ? (
              <span className="text-red-500">로그인에 실패했습니다.</span>
            ) : (
              <></>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            로그인
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
