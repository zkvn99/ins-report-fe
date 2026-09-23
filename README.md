# 건강자산 & 보장분석

Vue 3 기반의 자료 업로드와 Report JSON Renderer입니다. 보험 매핑, 건강 판정, 통계 선택, AI 호출은 Backend 책임이며 이 프로젝트는 결과 Report JSON만 A4 형식으로 표시합니다.

## 실행

```bash
npm install
npm run dev
```

로컬에서는 브라우저가 동일 Origin의 `/api`를 호출하고 Vite가 Spring으로 프록시합니다. 별도의 API Origin을 지정하지 않습니다.

```dotenv
VITE_API_BASE_URL=
VITE_SPRING_PROXY_TARGET=http://localhost:8080
```

환경별 파일은 다음처럼 분리되어 있습니다.

| 파일 | 용도 | API 연결 |
| --- | --- | --- |
| `.env.development` | 로컬 개발 | Vite `/api` 프록시 |
| `.env.production` | 운영 빌드 | nginx/게이트웨이의 동일 Origin `/api` |

운영 웹 서버는 `/api/*` 요청을 Backend로 전달해야 합니다. 프론트와 API를 다른 Site로 배포해야 하는 경우에만 `VITE_API_BASE_URL`을 HTTPS API 주소로 설정하고 Backend도 `JWT_COOKIE_SECURE=true`, `JWT_COOKIE_SAME_SITE=None`, `CORS_ALLOWED_ORIGINS`를 함께 설정합니다.

## 화면

- `/upload`: 건강검진 PDF, 보험 보장분석 PDF, 선택 권장금액 XLS/XLSX 업로드
- `/analysis/:analysisId`: Backend 분석 상태 조회
- `/report/:reportId`: Backend Report JSON 조회 및 A4 출력
- `/render`: 사용자가 붙여넣거나 선택한 Report JSON 렌더링

## 검증과 빌드

```bash
npm test
npm run build
npm run build:dev
npm run build:prod
```
