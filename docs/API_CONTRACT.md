# BE / FE API 계약

## 1. 공통 응답

백엔드 REST API는 `ApiResponse<T>`를 공통 응답 형식으로 사용한다.

성공:

```json
{
  "success": true,
  "data": {},
  "errorCode": null,
  "errorMessage": null,
  "timestamp": "2026-09-16T17:00:00"
}
```

실패:

```json
{
  "success": false,
  "data": null,
  "errorCode": "REPORT_...",
  "errorMessage": "사용자에게 표시 가능한 메시지",
  "timestamp": "2026-09-16T17:00:00"
}
```

FE의 `httpClient`에서 성공 응답의 `data`를 한 번만 unwrap한다.
페이지와 Feature Component는 `ApiResponse` 구조를 직접 알지 않도록 한다.

## 2. v1 API

```text
POST /api/v1/analysis
GET  /api/v1/analysis/{analysisId}
GET  /api/v1/reports/{reportId}
GET  /api/v1/reports/{reportId}/pdf
```

업로드 Multipart Field:

```text
files[]  # PDF 1개 이상 + Excel 0~1개
```

POST 응답:

```json
{
  "analysisId": "UUID",
  "status": "RECEIVED",
  "progress": 0,
  "message": "분석 요청이 등록되었습니다.",
  "reportId": null
}
```

분석 상태 응답 예시:

```json
{
  "analysisId": "...",
  "status": "PROCESSING",
  "progress": 40,
  "message": "보험 보장자료를 분석하고 있습니다.",
  "reportId": null
}
```

초기 상태 흐름:

```text
RECEIVED
  -> PROCESSING
  -> COMPLETED | FAILED
```

`reportId`는 `status == COMPLETED`인 경우에만 필수다.

`GET /api/v1/reports/{reportId}`는 Extraction 원문이 아니라 Backend가 계산해 저장한
최종 `ReportRenderModel`을 반환한다. Frontend는 `reportValidator` 검증 후
`ReportView -> ReportDocument`로 표시하며 보장 매핑, 권장금액, gap, 건강상태 또는
통계를 다시 계산하지 않는다.

최종 모델은 `health.areas`, 전체 `health.metrics`, `insurance.coverages[118]`,
`diseaseModules[9]`, `coveragePages`, `recommendations`, `statistics`와 기준 데이터
버전을 포함한다.

PDF 버튼은 `GET /api/v1/reports/{reportId}/pdf`의 binary 응답을 다운로드한다.
파일명은 `medicover-report-{reportId}.pdf`이며 브라우저 인쇄본은 최종 PDF가 아니다.

## 3. 계약 변경 규칙

API 필드명은 임의로 변경하지 않는다.
계약을 변경할 경우 하나의 작업에서 다음 항목을 함께 수정한다.

1. BE Request / Response DTO
2. FE API / Validator
3. 관련 테스트
4. 본 문서
