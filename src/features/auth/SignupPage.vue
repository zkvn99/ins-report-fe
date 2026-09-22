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
  <section class="auth-page">
    <div class="auth-panel">
      <p class="home-kicker">START YOUR MEDICOVER</p>
      <h1>회원가입</h1>
      <p class="auth-lead">분석을 시작하기 위한 기본 정보를 입력해주세요.</p>
    <form class="auth-form" @submit.prevent="submit">
      <label>아이디<input v-model.trim="form.loginId" required autocomplete="username"></label>
      <label>이메일<input v-model.trim="form.email" required type="email" autocomplete="email"></label>
      <label>비밀번호<input v-model="form.password" required minlength="8" type="password" autocomplete="new-password"></label>
      <label>이름<input v-model.trim="form.name" required autocomplete="name"></label>
      <label>전화번호<input v-model.trim="form.phone" required placeholder="010-1234-5678" autocomplete="tel"></label>
      <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
      <AppButton type="submit" :disabled="isSubmitting">{{ isSubmitting ? '가입 중...' : '회원가입' }}</AppButton>
    </form>
    </div>
  </section>
</template>
