# 노드 세팅 방법
1. node.js v20.18.0 을 설치필요
2. pnpm 패키지 매니저 설치
```bash
npm install -g pnpm
```

# 서버 실행 방법

```bash
# 라이브러리 설치
pnpm install

# 인증 라이브러리 환경변수 값 생성
npx auth secret

# 서버 실행 명령어
pnpm dev-webpack
```