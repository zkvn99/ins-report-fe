# Customer Input v2

AI가 만들어야 하는 데이터는 `customer_input version 2.0`입니다.

## 필수에 가까운 핵심 필드

```json
{
  "version": "2.0",
  "report_date": "2026-09-14",
  "customer": {},
  "health": { "metrics": [] },
  "insurance": { "source_complete": true, "coverages": [] },
  "standards": [],
  "issues": []
}
```

## health.records

검진기관/검진일이 서로 다른 기록을 보존합니다.

```json
{
  "record_key": "GENERAL-2026",
  "provider": "국민건강보험공단",
  "checkup_date": "2026-07-08",
  "institution": "검진기관",
  "source_ref": "file.pdf p.1"
}
```

기존 `health.source`도 Normalizer가 읽을 수 있습니다.

## insurance.coverages

AI는 원문 행을 보존합니다.

가장 중요한 필드는:

- `policy_key`: 서로 다른 계약 구분
- `source_entry_key`: 원문 행 중복 방지
- `source_group`: 메리츠 보장분석의 표 섹션/보장분류
- `rider_name`: 실제 담보명
- `amount_won`: 원 단위
- `coverage_id`: 확실할 때만 C001~C118
- `insured`: self/other/unknown
- `source_ref`: 원문 위치

`aggregation_type`, `benefit_pool_id`는 Rule Engine에서 결정하는 것을 기본으로 합니다.
