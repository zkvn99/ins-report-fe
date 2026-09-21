<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '../../api/authApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'

const router = useRouter()
const form = reactive({ loginId: '', email: '', password: '', name: '', phone: '' })
const errorMessage = ref('')
const isSubmitting = ref(false)

async function submit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await signup(form)
    await router.push('/login')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-panel">
    <h1>회원가입</h1>
    <form class="auth-form" @submit.prevent="submit">
      <label>아이디<input v-model.trim="form.loginId" required autocomplete="username"></label>
      <label>이메일<input v-model.trim="form.email" required type="email" autocomplete="email"></label>
      <label>비밀번호<input v-model="form.password" required minlength="8" type="password" autocomplete="new-password"></label>
      <label>이름<input v-model.trim="form.name" required autocomplete="name"></label>
      <label>전화번호<input v-model.trim="form.phone" required placeholder="010-1234-5678" autocomplete="tel"></label>
      <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
      <AppButton type="submit" :disabled="isSubmitting">{{ isSubmitting ? '가입 중...' : '회원가입' }}</AppButton>
    </form>
  </section>
</template>

<style scoped>
.auth-panel{max-width:520px;margin:48px auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:32px}.auth-form{display:grid;gap:18px;margin-top:24px}.auth-form label{display:grid;gap:8px;font-weight:700}.auth-form input{border:1px solid var(--line);border-radius:8px;padding:12px;font:inherit}
</style>
