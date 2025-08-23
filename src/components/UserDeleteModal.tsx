"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface UserDeleteModalProps {
  user: {
    id: number;
    name: string;
    role: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => void;
}

export function UserDeleteModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}: UserDeleteModalProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirm(user.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>사용자 삭제</DialogTitle>
              <DialogDescription>
                이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            다음 사용자를 삭제하시겠습니까?
          </p>
          {user && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">이름:</span>
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">역할:</span>
                <span className="text-sm">{user.role}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-destructive mt-4">
            ⚠️ 이 사용자와 관련된 모든 데이터가 영구적으로 삭제됩니다.
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
