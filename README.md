# 건강자산 & 보장분석

Vue 3 기반의 자료 업로드와 Report JSON Renderer입니다. 보험 매핑, 건강 판정, 통계 선택, AI 호출은 Backend 책임이며 이 프로젝트는 결과 Report JSON만 A4 형식으로 표시합니다.

## 실행

```bash
npm install
npm run dev
```

`.env.example`을 복사해 API 주소를 설정합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

## 화면

- `/upload`: 건강검진 PDF, 보험 보장분석 PDF, 선택 권장금액 XLS/XLSX 업로드
- `/analysis/:analysisId`: Backend 분석 상태 조회
- `/report/:reportId`: Backend Report JSON 조회 및 A4 출력
- `/render`: 사용자가 붙여넣거나 선택한 Report JSON 렌더링

## 검증과 빌드

```bash
npm test
npm run build
```
