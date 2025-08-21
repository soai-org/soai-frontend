"use client";

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";

interface Patient {
  name: string;
  birthdate: string;
  gender: string;
  searchCount: number;
}

interface AppSidebarProps {
  onDataRequest: (patient: Patient) => void;
}

export function AppSidebar({ onDataRequest }: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients: Patient[] = [
    { name: "김철수", birthdate: "1990-05-15", gender: "남", searchCount: 12 },
    { name: "이영희", birthdate: "1988-11-22", gender: "여", searchCount: 8 },
    { name: "박민수", birthdate: "1992-03-01", gender: "남", searchCount: 5 },
    { name: "최지영", birthdate: "1985-07-10", gender: "여", searchCount: 15 },
    { name: "정현우", birthdate: "1995-01-20", gender: "남", searchCount: 3 },
    { name: "강수진", birthdate: "1980-09-03", gender: "여", searchCount: 20 },
    { name: "윤서준", birthdate: "1998-04-12", gender: "남", searchCount: 7 },
    { name: "임은지", birthdate: "1993-06-25", gender: "여", searchCount: 10 },
    { name: "장동건", birthdate: "1972-03-07", gender: "남", searchCount: 2 },
    { name: "고소영", birthdate: "1972-10-06", gender: "여", searchCount: 18 },
    { name: "김민준", birthdate: "1991-02-18", gender: "남", searchCount: 6 },
    { name: "이지은", birthdate: "1993-05-16", gender: "여", searchCount: 11 },
    { name: "박서준", birthdate: "1988-12-16", gender: "남", searchCount: 9 },
    { name: "최우식", birthdate: "1990-03-26", gender: "남", searchCount: 4 },
    { name: "정해인", birthdate: "1988-04-01", gender: "남", searchCount: 13 },
    { name: "강하늘", birthdate: "1990-02-21", gender: "남", searchCount: 1 },
    { name: "윤아", birthdate: "1990-05-30", gender: "여", searchCount: 16 },
    { name: "임시완", birthdate: "1988-12-01", gender: "남", searchCount: 14 },
    { name: "장나라", birthdate: "1981-03-18", gender: "여", searchCount: 19 },
    { name: "고윤정", birthdate: "1996-04-22", gender: "여", searchCount: 7 },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDataRequest = () => {
    if (selectedPatient) {
      onDataRequest(selectedPatient);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-semibold">메뉴</h2>
      </SidebarHeader>
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
              placeholder="환자 이름으로 검색..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto mb-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
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
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => alert("설정")}
          >
            <Settings className="mr-2 h-4 w-4" />
            설정
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
