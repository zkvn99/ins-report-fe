import { ref } from 'vue'

export const currentAnalysisResult = ref(null)

export function setAnalysisResult(result) {
  currentAnalysisResult.value = result
}
