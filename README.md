# 건강자산 & 보장분석 - Vue Refactor

기존 단일 HTML 시안을 Vue 3 + Vite 기반으로 다시 분리한 유지보수용 프로젝트입니다.

## 목표

```text
PDF / Excel
   ↓ AI Extractor
customer_input_v2.json
   ↓
Normalizer / Validator
   ↓
Health / Insurance / Statistics Engine
   ↓
ReportViewModel
   ↓
Vue A4 Renderer
   ↓
HTML / PDF
```

AI는 원문 사실 추출에 집중하고 계산·합산·페이지 출력은 코드가 담당합니다.

## 바로 실행

macOS:

```bash
./setup-mac.sh
npm run dev
```

이미 Node가 있으면:

```bash
npm install
npm run check:data
npm run dev
```

## 고객 데이터 넣기

`examples/customer-input.example.json`을 먼저 넣어 동작을 확인합니다.

실제 고객 자료는 `prompts/SHORT_START_PROMPT.txt`와 `prompts/CUSTOMER_JSON_PROMPT.txt`를 사용해 JSON으로 만듭니다.

## 빌드

```bash
npm run build:single
```

결과:

```text
dist/health-asset-report.html
```

브라우저에서 JSON을 불러온 뒤 `인쇄 · PDF`를 사용합니다.

## 문서

- `docs/MAC_SETUP.md`
- `docs/ARCHITECTURE.md`
- `docs/INPUT_FORMAT.md`
- `docs/INSURANCE_MAPPING_RULES.md`
- `docs/MAINTENANCE.md`

## 중요한 설계 결정

- Vue Router 없음: 보고서는 SPA 라우팅이 필요하지 않습니다.
- Pinia 없음: 고객 한 건의 보고서 상태만 다루므로 composable 하나로 충분합니다.
- TypeScript 강제 없음: JavaScript 모듈을 작게 유지합니다.
- 이전 V4~V9 함수 override 없음.
- v1 입력 호환코드는 런타임에서 제거했습니다. 필요하면 별도 일회성 변환 스크립트로 처리합니다.
