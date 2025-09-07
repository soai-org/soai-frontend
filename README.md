# soai-frontend

## 📝 프로젝트 개요

본 프로젝트는 의료 영상 분석 AI 플랫폼 SOAI의 프론트엔드 애플리케이션입니다. Next.js를 기반으로 구축되었으며, 사용자가 웹 브라우저를 통해 의료 영상(DICOM)을 조회하고 AI 기반의 다양한 분석 기능을 활용할 수 있는 인터페이스를 제공합니다.

## 🚀 주요 기능

- **사용자 인증:** NextAuth.js를 활용한 안전한 로그인 및 세션 관리 기능을 제공합니다.
- **대시보드:** 환자 리스트 및 선택 환자 스터디 리스트를 확인할 수 있습니다.
- **DICOM 뷰어:** Cornerstone.js를 사용하여 웹 기반의 인터랙티브 DICOM 뷰어를 제공합니다.
- **AI 챗봇:** AI 모델과 연동하여 의료 관련 질문에 답변하는 챗봇 인터페이스를 제공합니다.
- **사용자 관리:** 관리자가 시스템 사용자를 생성, 수정, 삭제할 수 있는 관리자 페이지를 제공합니다.

## 🛠️ 기술 스택

- **Framework**: [Next.js](https://nextjs.org/), [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [lucide-react](https://lucide.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **DICOM Viewer**: [Cornerstone.js](https://www.cornerstonejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## ⚙️ 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/soai-org/soai-frontend.git
cd soai-frontend
```

### 2. 의존성 설치

`pnpm`을 사용하여 프로젝트 의존성을 설치합니다.

```bash
pnpm install
```

### 3. 환경 변수 설정

루트 디렉터리에 `.env.local` 파일을 생성하고, 아래와 같이 필요한 환경 변수를 설정합니다.

```.env
# 백엔드 API 서버의 기본 URL
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# DICOM 파일을 제공하는 스프링 서버의 URL
NEXT_PUBLIC_SPRING_SERVER=http://localhost:8080

# NextAuth.js JWT 암호화를 위한 시크릿 키
# 아래 명령어로 키를 생성할 수 있습니다: openssl rand -base64 32
AUTH_SECRET=your_auth_secret
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

서버가 정상적으로 실행되면 `http://localhost:3000`에서 애플리케이션을 확인할 수 있습니다.

## 📁 디렉터리 구조

```
.
├── .next/              # Next.js 빌드 결과물
├── node_modules/       # 의존성 모듈
├── public/             # 정적 파일 (이미지, 더미 데이터)
├── src/
│   ├── app/            # Next.js App Router (페이지 및 레이아웃)
│   ├── components/     # UI 컴포넌트
│   ├── hooks/          # 커스텀 React Hooks
│   ├── lib/            # 유틸리티 및 라이브러리 설정
│   ├── providers/      # React Context 프로바이더
│   ├── query/          # TanStack Query 관련 API 함수
│   └── types/          # TypeScript 타입 정의
├── .gitignore
├── next.config.ts      # Next.js 설정 파일
├── package.json        # 프로젝트 정보 및 의존성
├── pnpm-lock.yaml
├── README.md           # 프로젝트 설명서
└── tsconfig.json       # TypeScript 설정 파일
```
