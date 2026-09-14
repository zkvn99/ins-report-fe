/**
 * @typedef {'self'|'other'|'unknown'} InsuredScope
 * @typedef {'SUM'|'MAX'|'UNIQUE_POOL'|'PER_DAY'|'PER_EVENT'|'REIMBURSEMENT'|'NON_COMPARABLE'} AggregationType
 * @typedef {'DIRECT_ID'|'RULE'|'UNMAPPED'|'INVALID_ID'|'AMBIGUOUS_RULE'} MappingStatus
 *
 * @typedef {Object} InsuranceCoverageInput
 * @property {string} source_entry_key
 * @property {string|null} policy_key
 * @property {string} company
 * @property {string} product
 * @property {string|null} source_group
 * @property {string} rider_name
 * @property {number|null} amount_won
 * @property {string|null} coverage_id
 * @property {InsuredScope} insured
 * @property {string|null} source_ref
 *
 * @typedef {Object} CoverageSnapshot
 * @property {string} id
 * @property {string} name
 * @property {number} currentWon
 * @property {number} targetWon
 * @property {number} gapWon
 * @property {number} ratio
 * @property {'ABSENT'|'BELOW'|'ENOUGH'} status
 */

export {}
