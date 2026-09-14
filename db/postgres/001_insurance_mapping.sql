-- Prototype schema for moving the local insurance mapping rules into PostgreSQL.
-- Keep raw facts, rule decisions, and customer snapshots separate.

create table if not exists insurance_benefit_raw (
    id                  bigserial primary key,
    customer_id         uuid not null,
    source_document_id  varchar(100),
    source_entry_key    varchar(160) not null,
    policy_key          varchar(160),
    provider_type       varchar(50) not null,
    company_name        varchar(200),
    product_name        varchar(300),
    source_group        varchar(300),
    rider_name          varchar(500) not null,
    amount_won          bigint,
    amount_basis        varchar(50),
    payment_type        varchar(50),
    insured_scope       varchar(20) not null,
    source_ref          varchar(500),
    created_at          timestamptz not null default now(),
    unique (customer_id, source_document_id, source_entry_key)
);

create table if not exists coverage_mapping_rule (
    id                      bigserial primary key,
    rule_code               varchar(100) not null unique,
    enabled                 boolean not null default true,
    priority                integer not null default 0,
    provider_type           varchar(50),
    company_pattern         varchar(500),
    product_pattern         varchar(500),
    source_group_pattern    varchar(500),
    rider_pattern           varchar(1000),
    target_coverage_id      varchar(20) not null,
    mapping_type            varchar(30) not null default 'DIRECT',
    aggregation_type        varchar(30) not null,
    payment_type            varchar(50),
    valid_from              date,
    valid_to                date,
    rule_version            integer not null default 1,
    note                    text,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

create table if not exists coverage_mapping_result (
    id                  bigserial primary key,
    raw_benefit_id      bigint not null references insurance_benefit_raw(id),
    mapping_rule_id     bigint references coverage_mapping_rule(id),
    target_coverage_id  varchar(20),
    mapping_status      varchar(30) not null,
    aggregation_type    varchar(30),
    benefit_pool_id     varchar(160),
    confidence          numeric(5,4),
    reviewed            boolean not null default false,
    reviewer_id         uuid,
    created_at          timestamptz not null default now()
);

create table if not exists coverage_snapshot (
    id                  bigserial primary key,
    customer_id         uuid not null,
    snapshot_date       date not null,
    coverage_id         varchar(20) not null,
    current_won         bigint not null,
    target_won          bigint not null,
    gap_won             bigint not null,
    status              varchar(20) not null,
    calculation_version varchar(50) not null,
    created_at          timestamptz not null default now(),
    unique (customer_id, snapshot_date, coverage_id, calculation_version)
);

create index if not exists ix_insurance_benefit_raw_customer
    on insurance_benefit_raw(customer_id);

create index if not exists ix_mapping_rule_lookup
    on coverage_mapping_rule(provider_type, enabled, priority desc);

create index if not exists ix_mapping_result_raw
    on coverage_mapping_result(raw_benefit_id);
