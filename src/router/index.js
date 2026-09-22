import { createRouter, createWebHistory } from 'vue-router'
import ReportUploadPage from '../features/upload/ReportUploadPage.vue'
import ReportAnalysisPage from '../features/analysis/ReportAnalysisPage.vue'
import JsonRenderPage from '../features/json-render/JsonRenderPage.vue'
import BackendReportPage from '../features/report/BackendReportPage.vue'
import LoginPage from '../features/auth/LoginPage.vue'
import SignupPage from '../features/auth/SignupPage.vue'
import HomePage from '../features/home/HomePage.vue'
import HistoryPage from '../features/history/HistoryPage.vue'
import CommunityPage from '../features/community/CommunityPage.vue'
import { initialize, isAuthenticated } from '../features/auth/authSession.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage, meta: { guestOnly: true } },
    { path: '/signup', component: SignupPage, meta: { guestOnly: true } },
    { path: '/upload', component: ReportUploadPage, meta: { requiresAuth: true } },
    { path: '/analysis/:analysisId', component: ReportAnalysisPage, props: true, meta: { requiresAuth: true } },
    { path: '/report/:reportId', component: BackendReportPage, props: true, meta: { requiresAuth: true } },
    { path: '/history', component: HistoryPage, meta: { requiresAuth: true } },
    { path: '/community', component: CommunityPage },
    { path: '/render', component: JsonRenderPage }
  ]
})

if (typeof window !== 'undefined') {
  window.addEventListener('medicover:session-replaced', () => {
    if (router.currentRoute.value.path !== '/login') {
      router.push({ path: '/login', query: { reason: 'session-replaced' } })
    }
  })
}

router.beforeEach(async (to) => {
  await initialize()
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated.value) return '/'
  return true
})

export default router
