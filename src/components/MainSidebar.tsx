"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";

import { useSearchPatientByName } from "@/query/patient";
import { useDebounce } from "@/hooks/useDebounce";
import { Patient } from "@/types/patient";

interface AppSidebarProps {
  onDataRequest: (patient: Patient) => void;
}

export function MapSidebar({ onDataRequest }: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);
  const {
    data: patients,
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
    refetchPatient();
  }, [refetchPatient, debouncedSearchTerm]);

  useEffect(() => {
    console.log(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="mb-4">
            <Label
              htmlFor="patient-search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              환자 검색
            </Label>
            <Input
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
          <div className="space-y-2 max-h-[50vh] min-h-[50vh] overflow-y-auto mb-4">
            {isSuccessPatient ? (
              patients.map((patient, index) => (
                <div
                  key={index}
                  className={`p-2 hover:bg-gray-200 rounded-md cursor-pointer flex justify-between items-center ${selectedPatient?.name === patient.name ? "bg-gray-200" : ""}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <span>{patient.name}</span>
                  <span className="text-sm text-gray-500">
                    {patient.birthdate}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
            )}
          </div>
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
              <Button className="w-full" onClick={handleDataRequest}>
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
            className="w-full justify-start"
            onClick={() => alert("로그아웃")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
          <Link href="/setting/users" passHref>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Button>
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
