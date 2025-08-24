"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserEditModal } from "@/components/UserEditModal";
import { UserDeleteModal } from "@/components/UserDeleteModal";
import { UserCreateModal } from "@/components/UserCreateModal";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Users,
  Edit,
  Trash2,
} from "lucide-react";

// 임시 사용자 데이터 (실제로는 API에서 가져올 데이터)
const mockUsers = [
  {
    id: 1,
    name: "김의사",
    email: "doctor.kim@hospital.com",
    department: "내과",
    role: "의사",
    status: "활성",
    lastLogin: "2024-01-15 14:30",
    joinDate: "2023-03-15",
  },
  {
    id: 2,
    name: "이간호사",
    email: "nurse.lee@hospital.com",
    department: "외과",
    role: "간호사",
    status: "활성",
    lastLogin: "2024-01-15 13:45",
    joinDate: "2023-05-20",
  },
  {
    id: 3,
    name: "박원무",
    email: "admin.park@hospital.com",
    department: "원무과",
    role: "관리자",
    status: "활성",
    lastLogin: "2024-01-15 12:15",
    joinDate: "2023-01-10",
  },
  {
    id: 4,
    name: "최의사",
    email: "doctor.choi@hospital.com",
    department: "소아과",
    role: "의사",
    status: "비활성",
    lastLogin: "2024-01-10 09:20",
    joinDate: "2023-07-01",
  },
  {
    id: 5,
    name: "정간호사",
    email: "nurse.jung@hospital.com",
    department: "응급실",
    role: "간호사",
    status: "활성",
    lastLogin: "2024-01-15 15:00",
    joinDate: "2023-09-15",
  },
];

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (typeof mockUsers)[0] | null
  >(null);
  const [userToDelete, setUserToDelete] = useState<
    (typeof mockUsers)[0] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 현재 로그인한 사용자의 역할 (실제로는 인증 시스템에서 가져와야 함)
  const currentUserRole = "admin"; // 임시로 admin으로 설정

  const handleEditUser = (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = (userId: number) => {
    console.log("삭제할 사용자 ID:", userId);
    // TODO: 사용자 삭제 API 호출
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      alert(`사용자 "${user.name}"이 삭제되었습니다.`);
    }
  };

  const handleCreateUser = (userData: {
    name: string;
    role: string;
    password: string;
  }) => {
    console.log("새 사용자 생성:", userData);
    // TODO: 사용자 생성 API 호출
    const newUser = {
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      name: userData.name,
      email: `${userData.name.toLowerCase()}@hospital.com`,
      department: "미지정",
      role: userData.role,
      status: "활성",
      lastLogin: "로그인 기록 없음",
      joinDate: new Date().toISOString().split("T")[0],
    };

    // 실제로는 API 호출 후 성공 시에만 추가
    alert(`사용자 "${userData.name}"이 생성되었습니다.`);
  };

  const handleSaveUser = (
    updatedUser: (typeof mockUsers)[0] & { password?: string },
  ) => {
    console.log("수정된 사용자 정보:", updatedUser);
    // TODO: 사용자 수정 API 호출
    if (updatedUser.password) {
      console.log("비밀번호도 함께 변경됨");
    }
    alert(`사용자 "${updatedUser.name}"의 정보가 수정되었습니다.`);
  };

  // 필터링된 사용자 목록
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // 검색이나 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">사용자 관리</h1>
        <p className="text-muted-foreground">
          현재 서비스를 사용하는 사용자 목록을 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  총 사용자
                </p>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  의사
                </p>
                <p className="text-2xl font-bold">
                  {mockUsers.filter((u) => u.role === "의사").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  간호사
                </p>
                <p className="text-2xl font-bold">
                  {mockUsers.filter((u) => u.role === "간호사").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="이름 또는 ID로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="의사">의사</SelectItem>
                  <SelectItem value="간호사">간호사</SelectItem>
                  <SelectItem value="관리자">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>사용자 목록</CardTitle>
              <CardDescription>
                총 {filteredUsers.length}명의 사용자가 있습니다
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                사용자 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[150px]">이름</TableHead>
                <TableHead className="w-[100px]">역할</TableHead>
                <TableHead className="w-[80px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">작업 메뉴 열기</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditUser(user.id)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  총 {filteredUsers.length}명 중 {startIndex + 1}-
                  {Math.min(endIndex, filteredUsers.length)}명 표시
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="itemsPerPage" className="text-sm">
                    페이지당:
                  </Label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* 페이지 번호들 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // 현재 페이지 주변의 페이지들만 표시
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    },
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사용자 수정 모달 */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        currentUserRole={currentUserRole}
      />

      {/* 사용자 삭제 확인 모달 */}
      <UserDeleteModal
        user={userToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* 사용자 생성 모달 */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
}
