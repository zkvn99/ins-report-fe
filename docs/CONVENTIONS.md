# 프론트엔드 개발 컨벤션

## 1. 디렉터리별 책임

- `features/*Page.vue`: 페이지 단위 흐름, Loading/Error 상태, API 호출 조립
- `features/*/components`: 해당 Feature 전용 UI
- `shared/components`: 도메인 지식이 없는 재사용 UI
- `api`: BE 통신, 공통 응답 처리, 오류 정규화
- `report`: 검증된 Report JSON을 A4 리포트 UI로 렌더링
- 순수 `.js` 유틸: 파싱, 검증, 포맷팅, 페이지 계산 등

현재 구조를 유지하고 단순히 아키텍처 형식을 맞추기 위해 폴더를 늘리지 않는다.

## 2. API 접근 규칙

Component에서 `fetch`를 직접 사용하지 않는다.
기능 단위 API 함수를 호출한다.

```js
createReportAnalysis(formData)
getReportAnalysis(analysisId)
getReport(reportId)
```

`fetch`, Base URL, 공통 Header, `ApiResponse<T>` unwrap과 공통 오류 처리는 `httpClient.js`에서 담당한다.

페이지에서는 가능한 다음처럼 순수한 결과만 사용한다.

```js
const result = await getReportAnalysis(analysisId)
result.status
result.reportId
```

## 3. Report JSON 규칙

`reportValidator.js`를 프론트의 Report JSON 경계로 사용한다.

BE 계약이 변경되면 다음을 함께 수정한다.

1. Validator
2. 영향받는 Report Component
3. 테스트
4. API 계약 문서

기존 Optional Field는 가능하면 하위 호환되도록 처리한다.

건강 상태 판단, 보험 보장 충분/부족 판단 등의 업무 규칙을 Renderer에서 계산하지 않는다.
프론트는 BE에서 구성된 Report 데이터를 **표현하는 역할**에 집중한다.

## 4. Component 작성 기준

- 하위 Report/Shared Component에서 네트워크 요청을 하지 않는다.
- 파생 UI 값은 가능한 `computed`를 사용한다.
- Props는 필요한 값만 명확하게 전달한다.
- 실제로 여러 Route에서 공유되는 상태가 생기기 전에는 전역 상태를 과도하게 도입하지 않는다.
- 디자인 Token은 `styles/tokens.css`에 둔다.
- 인쇄 전용 스타일은 `styles/print.css`에 둔다.
- 한 Component가 지나치게 커지면 화면 영역 또는 책임 단위로 분리한다.

## 5. 네이밍

의미 없는 축약어보다 역할이 드러나는 이름을 사용한다.

권장:

```js
analysisId
reportData
healthCheckupSections
coverageSummary
isLoading
hasValidationError
```

지양:

```js
data2
obj
arr
info
temp
handleData()
```

API와 BE DTO의 필드명은 특별한 이유가 없다면 그대로 사용하여 불필요한 변환을 줄인다.
