# 유지보수 가이드

## 보장항목을 추가할 때

1. `src/data/coverage-catalog.json`에 새 C코드 추가
2. 필요하면 `health-areas.json`의 coverage_ids에 연결
3. 필요하면 `disease-modules.json`의 coverage_ids에 연결
4. `npm run check:data`
5. 테스트

## 질환 페이지를 추가할 때

1. `reference-statistics.json`에 통계/출처 추가
2. `disease-modules.json`에 모듈 추가
3. 기존 `DiseasePage.vue`가 자동 렌더링

새 질환 때문에 별도 페이지 JS를 복사하지 않는 것이 원칙입니다.

## 디자인 수정

- 전체 색상: `styles/tokens.css`
- 공통 컴포넌트: `styles/components.css`
- A4 페이지: `styles/pages.css`
- 인쇄: `styles/print.css`

## 보험 금액이 이상할 때

화면 CSS를 보지 말고 순서대로 확인합니다.

```text
customer_input
→ coverageMapper
→ coverageAggregator
→ insuranceEngine
→ ReportViewModel
```

## 통계가 이상할 때

```text
reference-statistics.json
→ statisticsEngine.js
→ DiseasePage.vue
```

## 버전관리

V6/V7 같은 클래스나 `oldFunction = function` 패치를 만들지 않습니다.
변경 이력은 Git commit/tag로 남깁니다.
