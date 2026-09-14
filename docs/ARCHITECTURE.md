# Architecture

## 핵심 원칙

이 프로젝트는 기존 단일 HTML의 기능을 다음 4단계로 분리합니다.

```text
CustomerInput JSON
      ↓
Normalizer / Validator
      ↓
Domain Engines
      ↓
ReportViewModel
      ↓
Vue Renderer
```

Vue 컴포넌트는 보험 합계나 통계 선택을 직접 계산하지 않습니다.

## 폴더 책임

### `src/input`
AI가 생성한 JSON을 읽고 최소한의 형식 정규화를 합니다.

- BOM/코드블록 제거
- 날짜 표준화
- 만 나이 계산
- self/other/unknown 정규화
- blocking/warning 구분

### `src/domain/health`
검사값을 10개 건강영역으로 묶습니다.

### `src/domain/insurance`
보험의 가장 중요한 영역입니다.

```text
raw coverage
  ↓
coverageMapper
  ↓
coverageAggregator
  ↓
coverage snapshot
```

`coverageMapper`는 coverage_id 또는 검토된 룰만 사용합니다.
`coverageAggregator`가 SUM/MAX/UNIQUE_POOL/PER_DAY/PER_EVENT/REIMBURSEMENT를 담당합니다.

### `src/domain/statistics`
현재 연령에 맞는 통계 시계열과 질환별 공개 비용 자료를 선택합니다.

### `src/report`
도메인 결과를 화면에 바로 사용할 ViewModel로 만듭니다.

### `src/pages`, `src/components`
표시만 담당합니다. 업무 계산 로직을 넣지 않습니다.

## 금지 패턴

다음 패턴을 다시 만들지 않습니다.

```javascript
const oldRender = render
render = function () {
  oldRender()
  // patch
}
```

버전별 함수 덮어쓰기 대신 기존 함수를 수정하고 Git으로 버전을 관리합니다.
