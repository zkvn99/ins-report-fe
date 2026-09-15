export function fileKey(file) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function isAcceptedFile(file, extensions) {
  return extensions.some(extension => file.name.toLowerCase().endsWith(extension.toLowerCase()))
}

export function addUniqueFiles(current, files, multiple = true) {
  const candidates = multiple ? [...current, ...files] : files.slice(0, 1)
  return candidates.filter((file, index, list) => list.findIndex(item => fileKey(item) === fileKey(file)) === index)
}

export function createAnalysisFormData(healthFiles, insuranceFiles, standardFile) {
  const formData = new FormData()
  healthFiles.forEach(file => formData.append('healthFiles', file))
  insuranceFiles.forEach(file => formData.append('insuranceFiles', file))
  if (standardFile) formData.append('standardFile', standardFile)
  return formData
}
