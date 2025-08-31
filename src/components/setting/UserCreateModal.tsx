"use client";

import { useState } from "react";
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
import { UserPlus } from "lucide-react";
import { CreateUserInput, createUserSchema, UserRole } from "@/types/user";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: {
    id: string;
    name: string;
    role: UserRole;
    password: string;
  }) => Promise<void>;
}

export function UserCreateModal({
  isOpen,
  onClose,
  onCreate,
}: UserCreateModalProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    id: "",
    name: "",
    role: UserRole.Doctor,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUserInput, string>>
  >({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createUserSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateUserInput, string>> = {};
      result.error?.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateUserInput;
        fieldErrors[field] = issue.message;
      });
      console.log(errors);
      setErrors(fieldErrors);
    } else {
      // 유저 생성 요청
      try {
        await onCreate({
          id: formData.id.trim(),
          name: formData.name.trim(),
          role: formData.role,
          password: formData.password,
        });

        // 폼 초기화
        setFormData({
          id: "",
          name: "",
          role: UserRole.Doctor,
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        onClose();
      } catch (_) {
        alert("유저 생성에 실패했습니다.");
      }
    }
  };

  const handleClose = () => {
    // 폼 초기화
    setFormData({
      id: "",
      name: "",
      role: UserRole.Doctor,
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>새 사용자 생성</DialogTitle>
              <DialogDescription>
                새로운 사용자 계정을 생성합니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                ID
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  className={errors.id ? "border-destructive" : ""}
                  placeholder="사용자 ID"
                />
                {errors.id && (
                  <p className="text-xs text-destructive">{errors.id}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                  placeholder="사용자 이름"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                역할
              </Label>
              <div className="col-span-3 space-y-1">
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger
                    className={errors.role ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.Doctor}>의사</SelectItem>
                    <SelectItem value={UserRole.Nurse}>간호사</SelectItem>
                    <SelectItem value={UserRole.Admin}>관리자</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-destructive">{errors.role}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                비밀번호
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={errors.password ? "border-destructive" : ""}
                  placeholder="비밀번호 (최소 6자)"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
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
                  className={errors.confirmPassword ? "border-destructive" : ""}
                  placeholder="비밀번호 재입력"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" className="gap-2">
              <UserPlus className="h-4 w-4" />
              생성
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
