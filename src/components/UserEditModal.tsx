"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  UpdateUserInput,
  UserRole,
  updateUserSchema,
} from "@/types/user";

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<User> & Pick<User, "userId">) => void;
  currentUserRole?: string;
}

export function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
  currentUserRole = "user",
}: UserEditModalProps) {
  const [formData, setFormData] = useState<UpdateUserInput>({
    name: "",
    role: UserRole.Nurse,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateUserInput, string>>
  >({});

  const isAdmin = currentUserRole === "admin";

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.userName,
        role: user.userRole,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateUserSchema.safeParse(formData);

    if (user) {
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof UpdateUserInput, string>> = {};
        result.error?.issues.forEach((issue) => {
          const field = issue.path[0] as keyof UpdateUserInput;
          fieldErrors[field] = issue.message;
        });
        console.log(errors);
        setErrors(fieldErrors);
      } else {
        try {
          const updatedUser: Partial<User> & Pick<User, "userId"> = {
            userId: user.userId,
            userName: formData.name,
            userRole: formData.role,
            ...(formData.password && { userPassword: formData.password }),
          };
          onSave(updatedUser);
          onClose();
        } catch (_) {
          alert("유저 업데이트에 실패했습니다. ");
        }
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 메시지 초기화
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
          <DialogDescription>
            사용자 정보를 수정하고 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                required
              />
              {errors.name && (
                <p className={"text-xs text-destructive"}>{errors.name}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                역할
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">의사</SelectItem>
                  <SelectItem value="nurse">간호사</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className={"text-xs text-destructive"}>{errors.role}</p>
              )}
            </div>
            {isAdmin && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    새 비밀번호
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="변경하려면 입력하세요"
                    />
                    {errors.password && (
                      <p className={"text-xs text-destructive"}>
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirmPassword" className="text-right">
                    비밀번호 확인
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="변경하려면 입력하세요"
                    />
                    {errors.confirmPassword && (
                      <p className={"text-xs text-destructive"}>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
