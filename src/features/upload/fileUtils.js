export function fileKey(file) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function isAcceptedFile(file, extensions, mimeTypes = []) {
  const hasAcceptedExtension = extensions.some(extension => file.name.toLowerCase().endsWith(extension.toLowerCase()))
  const hasAcceptedMime = !file.type || mimeTypes.length === 0 || mimeTypes.includes(file.type)
    || file.type === 'application/octet-stream'
  return hasAcceptedExtension && hasAcceptedMime
}

export function addUniqueFiles(currentFiles = [], incomingFiles = [], multiple = true) {
  const current = Array.isArray(currentFiles) ? currentFiles : []
  const incoming = Array.from(incomingFiles ?? [])
  const candidates = multiple ? [...current, ...incoming] : incoming.slice(0, 1)
  return candidates.filter((file, index, list) => list.findIndex(item => fileKey(item) === fileKey(file)) === index)
}

export function createAnalysisFormData(files) {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  return formData
}
