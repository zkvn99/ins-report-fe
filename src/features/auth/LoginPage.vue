<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from './authSession.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'

const router = useRouter()
const route = useRoute()
const form = reactive({ loginId: '', password: '' })
const errorMessage = ref('')
const isSubmitting = ref(false)

async function submit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect.startsWith('/') ? redirect : '/')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-panel">
      <p class="home-kicker">WELCOME TO MEDICOVER</p>
      <h1>로그인</h1>
      <p class="auth-lead">건강과 보장을 함께 보는 가장 쉬운 방법</p>
    <form class="auth-form" @submit.prevent="submit">
      <label>아이디<input v-model.trim="form.loginId" required autocomplete="username"></label>
      <label>비밀번호<input v-model="form.password" required type="password" autocomplete="current-password"></label>
      <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
        <AppButton type="submit" :disabled="isSubmitting">{{ isSubmitting ? '로그인 중...' : '로그인' }}</AppButton>
      </form>
      <div class="auth-links"><RouterLink to="/signup">회원가입</RouterLink><button type="button" disabled>아이디 찾기</button><button type="button" disabled>비밀번호 찾기</button></div>
      </div>
  </section>
</template>
