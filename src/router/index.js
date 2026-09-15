import { createRouter, createWebHistory } from 'vue-router'
import ReportUploadPage from '../features/upload/ReportUploadPage.vue'
import ReportAnalysisPage from '../features/analysis/ReportAnalysisPage.vue'
import JsonRenderPage from '../features/json-render/JsonRenderPage.vue'
import BackendReportPage from '../features/report/BackendReportPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/upload' },
    { path: '/upload', component: ReportUploadPage },
    { path: '/analysis/:analysisId', component: ReportAnalysisPage, props: true },
    { path: '/report/:reportId', component: BackendReportPage, props: true },
    { path: '/render', component: JsonRenderPage }
  ]
})
