import { createRouter, createWebHistory } from 'vue-router'
import ReportUploadPage from '../features/upload/ReportUploadPage.vue'
import ReportAnalysisPage from '../features/analysis/ReportAnalysisPage.vue'
import JsonRenderPage from '../features/json-render/JsonRenderPage.vue'
import BackendReportPage from '../features/report/BackendReportPage.vue'
import LoginPage from '../features/auth/LoginPage.vue'
import SignupPage from '../features/auth/SignupPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/upload', component: ReportUploadPage },
    { path: '/analysis/:analysisId', component: ReportAnalysisPage, props: true },
    { path: '/report/:reportId', component: BackendReportPage, props: true },
    { path: '/render', component: JsonRenderPage }
  ]
})
