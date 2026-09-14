# 보험 Mapping Rule 설계

## 왜 Rule Engine을 분리하는가

문서의 담보명이 같아 보여도 상품·판매시기·지급조건에 따라 의미가 다를 수 있습니다.
따라서 AI가 담보명을 보고 최종 금액을 결정하게 하지 않습니다.

## 권장 처리 순서

```text
1. coverage_id가 유효하면 직접 연결
2. 보험사 + 상품 + 섹션 + 담보명 exact rule
3. 보험사 + 담보명 exact rule
4. 검토된 pattern rule
5. 미매핑 보존
```

현재 소스는 1번과 검토된 로컬 룰만 사용합니다. 퍼지 매칭은 하지 않습니다.

## Rule 필드

```json
{
  "id": "RULE-001",
  "enabled": true,
  "priority": 100,
  "provider_type": "MERITZ_REPORT",
  "company_pattern": "^삼성화재$",
  "product_pattern": null,
  "source_group_pattern": "심장",
  "rider_pattern": "^급성심근경색증진단비$",
  "target_coverage_id": "C050",
  "mapping_type": "DIRECT",
  "aggregation_type": "SUM",
  "payment_type": "fixed_amount"
}
```

## Aggregation Type

- `SUM`: 독립적으로 지급 가능한 정액담보 합산
- `MAX`: 같은 조건 중 최대 1개만 의미 있는 경우
- `UNIQUE_POOL`: 하나의 보험금 원천이 여러 질환/코드에 연결되는 CI·복합급부
- `PER_DAY`: 일당
- `PER_EVENT`: 회당/수술당
- `REIMBURSEMENT`: 실손
- `NON_COMPARABLE`: 현재 권장금액 표와 직접 비교하지 않음

## benefit_pool_id

하나의 주계약 금액이 암·뇌·심장에 모두 표시되는 경우 경제적 원천은 하나일 수 있습니다.

```text
BP-001 3,000만원
 ├ C010
 ├ C037
 └ C050
```

각 질환 페이지에는 해당 금액을 보여줄 수 있지만 포트폴리오 전체를 단순 합산할 때는 한 번만 계산해야 합니다.

## DB 이전

운영 DB에서는 최소 다음 테이블을 권장합니다.

```text
insurance_benefit_raw
coverage_mapping_rule
coverage_mapping_result
coverage_snapshot
```

Vue 프로젝트의 `insurance-mapping-rules.json`은 DB 도입 전 로컬 프로토타입입니다.
