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
POST /api/v1/report-analyses
GET  /api/v1/report-analyses/{analysisId}
GET  /api/v1/reports/{reportId}
```

업로드 Multipart Field:

```text
healthFiles[]
insuranceFiles[]
standardFile?      # 선택: xls/xlsx
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
  -> REVIEW_REQUIRED | COMPLETED | FAILED
```

`reportId`는 `status == COMPLETED`인 경우에만 필수다.

## 3. 계약 변경 규칙

API 필드명은 임의로 변경하지 않는다.
계약을 변경할 경우 하나의 작업에서 다음 항목을 함께 수정한다.

1. BE Request / Response DTO
2. FE API / Validator
3. 관련 테스트
4. 본 문서
