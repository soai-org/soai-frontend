import { z } from "zod";

const idRegex = /^[A-za-z0-9_\-.]+$/;
const nameRegex = /^[A-za-z가-힣]+$/;
// 허용 문자: 알파벳, 숫자, 안전한 특수문자(!@#$%^&*()_-+=?)
const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_\-+=?]+$/;

export enum UserRole {
  Admin = "admin",
  Doctor = "doctor",
  Nurse = "nurse",
}

export const createUserSchema = z
  .object({
    id: z
      .string()
      .min(4, "ID는 최소 4 글자 이상이어야 합니다.")
      .max(50, "ID는 50 자를 초과할 수 없습니다.")
      .regex(idRegex, "허용되지 않는 문자가 포함되어 있습니다."),
    name: z
      .string()
      .max(50, "이름은 50자를 초과할 수 없습니다.")
      .regex(nameRegex, "허용되지 않는 문자가 포함되어 있습니다."),
    role: z.enum(UserRole),
    password: z
      .string()
      .min(4, "비밀번호는 최소 4자 이상이어야 합니다.")
      .max(100, "비밀번호는 100자를 초과할 수 없습니다.")
      .regex(passwordRegex, "허용되지 않는 문자가 포함되어 있습니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "비밀번호가 일치하지 않습니다.",
  });

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .max(50, "이름은 50자를 초과할 수 없습니다.")
      .regex(nameRegex, "허용되지 않는 문자가 포함되어 있습니다."),
    role: z.enum(UserRole),
    password: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => val === undefined || val.length >= 4, {
        error: "ID는 최소 4 글자 이상이어야 합니다.",
      })
      .refine(
        (val) => val === undefined || val.length <= 100,
        "비밀번호는 100자를 초과할 수 없습니다.",
      )
      .refine((val) => val === undefined || passwordRegex.test(val), {
        error: "허용되지 않는 문자가 포함되어 있습니다.",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password) {
        return true;
      } else {
        if (data.password === data.confirmPassword) return true;
        return false;
      }
    },
    {
      path: ["confirmPassword"],
      error: "비밀번호가 일치하지 않습니다.",
    },
  );

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export interface User {
  userId: string;
  userName: string;
  userRole: UserRole;
  userPassword: string;
  createdAt?: Date;
  updateAt?: Date;
}
