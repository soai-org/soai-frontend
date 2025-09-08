"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarInput,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { signOut } from "next-auth/react";
import { useSearchPatientByName } from "@/query/dashboard/patient";
import { useDebounce } from "@/hooks/useDebounce";
import { Patient } from "@/types/patient";
import Loading from "../Loading";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onDataRequest: (patient: Patient) => void;
}

export function MainSidebar({ onDataRequest }: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);
  const {
    data: patients,
    isLoading: isLoadingPatient,
    isSuccess: isSuccessPatient,
    refetch: refetchPatient,
  } = useSearchPatientByName(debouncedSearchTerm);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleDataRequest = () => {
    if (selectedPatient) {
      onDataRequest(selectedPatient);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      refetchPatient();
    }
  }, [refetchPatient, debouncedSearchTerm]);

  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mb-4">
              <Label className={"text-lg"} htmlFor="patient-search">
                환자 검색
              </Label>
              <SidebarInput
                id="patient-search"
                type="text"
                placeholder="환자 이름 검색..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </SidebarGroupContent>
          <SidebarGroupContent>
            <div className="space-y-2 max-h-[50vh] min-h-[50vh] overflow-y-auto mb-4">
              {isSuccessPatient &&
                patients.length > 0 &&
                patients.map((patient, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-2 hover:bg-gray-400 rounded-md cursor-pointer flex justify-between items-center",
                      selectedPatient?.uuid === patient.uuid
                        ? "bg-gray-400"
                        : "",
                    )}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <span>{patient.name}</span>
                    <span className="text-sm text-gray-200">
                      {patient.birthdate}
                    </span>
                  </div>
                ))}
              {isLoadingPatient && (
                <div
                  className={
                    "flex flex-col items-center justify-center w-full h-full"
                  }
                >
                  <Loading />
                </div>
              )}
              {isSuccessPatient && patients.length === 0 && (
                <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <h3 className="text-lg font-semibold mb-2">환자 상세 정보</h3>
          {selectedPatient ? (
            <>
              <div className="space-y-1 text-sm mb-4">
                <p>
                  <strong>성명:</strong> {selectedPatient.name}
                </p>
                <p>
                  <strong>생년월일:</strong> {selectedPatient.birthdate}
                </p>
                <p>
                  <strong>성별:</strong> {selectedPatient.gender}
                </p>
                <p>
                  <strong>검색 건수:</strong> {selectedPatient.searchCount}
                </p>
              </div>
              <Button
                className="w-full hover:cursor-pointer"
                onClick={handleDataRequest}
              >
                관련 데이터 요청
              </Button>
            </>
          ) : (
            <p className="text-sm text-gray-500">환자를 선택해주세요.</p>
          )}
        </SidebarGroup>
        <div className="mt-auto p-4 border-t border-gray-200 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start hover:cursor-pointer"
            onClick={() => signOut({ redirectTo: "/signin" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
          <Link href="/setting/users" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start hover:cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Button>
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
