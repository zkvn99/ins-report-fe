<script setup>
import { useRouter } from 'vue-router'
import AppButton from './AppButton.vue'
import { authUser, isAuthenticated, logout } from '../../features/auth/authSession.js'

const router = useRouter()

async function signOut() {
  try {
    await logout()
  } finally {
    await router.push('/')
  }
}
</script>

<template>
  <header class="app-header screen-only">
    <RouterLink class="brand-lockup" to="/">
      <strong>MIDA</strong>
      <span>미다</span>
    </RouterLink>
    <nav class="app-nav" aria-label="주요 메뉴">
      <RouterLink to="/upload">미다</RouterLink>
      <RouterLink to="/history">결과이력</RouterLink>
      <!-- <RouterLink to="/community">커뮤니티</RouterLink> -->
      <template v-if="isAuthenticated">
        <span class="user-greeting">{{ authUser.name }} 님</span>
        <AppButton v-if="authUser?.role === 'ADMIN'" variant="ghost" size="sm" @click="router.push('/admin/settings')">설정</AppButton>
        <AppButton variant="ghost" size="sm" @click="signOut">로그아웃</AppButton>
      </template>
      <template v-else>
        <RouterLink to="/login">로그인</RouterLink>
        <!-- <RouterLink class="nav-signup" to="/signup">회원가입</RouterLink> -->
      </template>
    </nav>
  </header>
</template>
