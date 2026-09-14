import { readFile } from 'node:fs/promises'

async function json(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
}

const catalog = await json('../src/data/coverage-catalog.json')
const areas = await json('../src/data/health-areas.json')
const modules = await json('../src/data/disease-modules.json')
const ref = await json('../src/data/reference-statistics.json')
const rules = await json('../src/data/insurance-mapping-rules.json')

function unique(items, label) {
  const ids = items.map(item => item.id)
  if (new Set(ids).size !== ids.length) throw new Error(`${label}: ID 중복`)
}

unique(catalog, 'coverage catalog')
unique(areas, 'health areas')
unique(modules, 'disease modules')

const coverageIds = new Set(catalog.map(item => item.id))
const areaIds = new Set(areas.map(item => item.id))
const sourceIds = new Set(ref.sources.map(item => item.id))

for (const area of areas) {
  for (const id of area.coverage_ids || []) {
    if (!coverageIds.has(id)) throw new Error(`health area ${area.id}: unknown coverage ${id}`)
  }
}

for (const module of modules) {
  for (const id of module.health_area_ids || []) {
    if (!areaIds.has(id)) throw new Error(`module ${module.id}: unknown health area ${id}`)
  }
  for (const id of module.coverage_ids || []) {
    if (!coverageIds.has(id)) throw new Error(`module ${module.id}: unknown coverage ${id}`)
  }
  if (module.history_id && !ref.historical_series?.[module.history_id]) throw new Error(`module ${module.id}: unknown history ${module.history_id}`)
  if (module.alternative_history_id && !ref.historical_series?.[module.alternative_history_id]) throw new Error(`module ${module.id}: unknown alternative history ${module.alternative_history_id}`)
  if (module.context_id && !ref.context_series?.[module.context_id]) throw new Error(`module ${module.id}: unknown context ${module.context_id}`)
  if (module.benchmark_id && !ref.benchmarks?.[module.benchmark_id]) throw new Error(`module ${module.id}: unknown benchmark ${module.benchmark_id}`)
}

for (const source of ref.sources) {
  if (!source.id) throw new Error('reference source: missing id')
}

for (const benchmark of Object.values(ref.benchmarks || {})) {
  if (benchmark.source_id && !sourceIds.has(benchmark.source_id)) throw new Error(`benchmark: unknown source ${benchmark.source_id}`)
}

for (const rule of rules.rules || []) {
  if (rule.target_coverage_id && !coverageIds.has(rule.target_coverage_id)) throw new Error(`mapping rule ${rule.id}: unknown coverage ${rule.target_coverage_id}`)
}

console.log(`OK: ${catalog.length} coverages, ${areas.length} health areas, ${modules.length} disease modules, ${ref.sources.length} sources`)
