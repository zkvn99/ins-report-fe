<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../api/authApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'

const router = useRouter()
const form = reactive({ loginId: '', password: '' })
const errorMessage = ref('')
const isSubmitting = ref(false)

async function submit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await login(form)
    await router.push('/upload')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-panel">
    <h1>로그인</h1>
    <form class="auth-form" @submit.prevent="submit">
      <label>아이디<input v-model.trim="form.loginId" required autocomplete="username"></label>
      <label>비밀번호<input v-model="form.password" required type="password" autocomplete="current-password"></label>
      <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
      <AppButton type="submit" :disabled="isSubmitting">{{ isSubmitting ? '로그인 중...' : '로그인' }}</AppButton>
    </form>
    <RouterLink to="/signup">계정이 없으면 회원가입</RouterLink>
  </section>
</template>

<style scoped>
.auth-panel{max-width:520px;margin:48px auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:32px}.auth-form{display:grid;gap:18px;margin:24px 0}.auth-form label{display:grid;gap:8px;font-weight:700}.auth-form input{border:1px solid var(--line);border-radius:8px;padding:12px;font:inherit}
</style>
