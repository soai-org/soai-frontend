import { CreateUserInput } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isZodError(err: unknown): err is ZodError<CreateUserInput> {
  return err instanceof ZodError;
}
