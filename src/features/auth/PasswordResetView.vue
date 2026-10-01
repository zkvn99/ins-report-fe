<script setup>
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  requestPasswordResetEmail,
  resetPassword,
  verifyPasswordResetEmail
} from '../../api/authApi.js'
import AppAlert from '../../shared/components/AppAlert.vue'
import AppButton from '../../shared/components/AppButton.vue'
import { validateNewPassword } from './passwordResetValidation.js'

const router = useRouter()
const step = ref('EMAIL')
const email = ref('')
const verificationCode = ref('')
const resetKey = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const errorMessage = ref('')
const infoMessage = ref('')
const isLoading = ref(false)
const cooldownSeconds = ref(0)
let cooldownTimer = null

function startCooldown() {
  if (cooldownTimer) window.clearInterval(cooldownTimer)
  cooldownSeconds.value = 60
  cooldownTimer = window.setInterval(() => {
    cooldownSeconds.value -= 1
    if (cooldownSeconds.value <= 0) {
      window.clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

async function sendVerificationCode({ isResend = false } = {}) {
  if (isLoading.value || (isResend && cooldownSeconds.value > 0)) return
  isLoading.value = true
  errorMessage.value = ''
  infoMessage.value = ''
  try {
    await requestPasswordResetEmail({ email: email.value.trim() })
    step.value = 'VERIFY'
    verificationCode.value = ''
    infoMessage.value = isResend ? '인증번호를 다시 발송했습니다.' : ''
    startCooldown()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function verifyCode() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = ''
  infoMessage.value = ''
  try {
    const response = await verifyPasswordResetEmail({
      email: email.value.trim(),
      verificationCode: verificationCode.value
    })
    resetKey.value = response.resetKey
    step.value = 'PASSWORD'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function changePassword() {
  if (isLoading.value) return
  errorMessage.value = validateNewPassword(newPassword.value, newPasswordConfirm.value)
  if (errorMessage.value) return

  isLoading.value = true
  try {
    await resetPassword({ resetKey: resetKey.value, newPassword: newPassword.value })
    resetKey.value = ''
    newPassword.value = ''
    newPasswordConfirm.value = ''
    step.value = 'COMPLETE'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function changeEmail() {
  verificationCode.value = ''
  errorMessage.value = ''
  infoMessage.value = ''
  step.value = 'EMAIL'
}

onUnmounted(() => {
  resetKey.value = ''
  if (cooldownTimer) window.clearInterval(cooldownTimer)
})
</script>

<template>
  <section class="auth-page">
    <div class="auth-panel">
      <p class="home-kicker">RESET YOUR PASSWORD</p>

      <template v-if="step === 'EMAIL'">
        <h1>비밀번호 재설정</h1>
        <p class="auth-lead">가입한 이메일을 입력해주세요.</p>
        <form class="auth-form" @submit.prevent="sendVerificationCode()">
          <label>이메일<input v-model.trim="email" required type="email" autocomplete="email"></label>
          <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
          <AppButton type="submit" :disabled="isLoading">{{ isLoading ? '발송 중...' : '인증번호 받기' }}</AppButton>
        </form>
        <div class="auth-links"><RouterLink to="/login">로그인으로 돌아가기</RouterLink></div>
      </template>

      <template v-else-if="step === 'VERIFY'">
        <h1>이메일 인증</h1>
        <p class="auth-lead"><strong>{{ email }}</strong>으로<br>인증번호를 발송했습니다.</p>
        <form class="auth-form" @submit.prevent="verifyCode">
          <label>인증번호<input v-model.trim="verificationCode" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="인증번호 6자리"></label>
          <AppAlert v-if="infoMessage" type="info">{{ infoMessage }}</AppAlert>
          <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
          <AppButton type="submit" :disabled="isLoading">{{ isLoading ? '확인 중...' : '인증하기' }}</AppButton>
        </form>
        <div class="auth-links">
          <button type="button" :disabled="isLoading || cooldownSeconds > 0" @click="sendVerificationCode({ isResend: true })">
            {{ cooldownSeconds > 0 ? `인증번호 다시 받기 (${cooldownSeconds}초)` : '인증번호 다시 받기' }}
          </button>
          <button type="button" @click="changeEmail">이메일 변경</button>
        </div>
      </template>

      <template v-else-if="step === 'PASSWORD'">
        <h1>새 비밀번호 설정</h1>
        <p class="auth-lead">새롭게 사용할 비밀번호를 입력해주세요.</p>
        <form class="auth-form" @submit.prevent="changePassword">
          <label>새 비밀번호<input v-model="newPassword" required minlength="8" maxlength="72" type="password" autocomplete="new-password"></label>
          <label>새 비밀번호 확인<input v-model="newPasswordConfirm" required minlength="8" maxlength="72" type="password" autocomplete="new-password"></label>
          <AppAlert v-if="errorMessage">{{ errorMessage }}</AppAlert>
          <AppButton type="submit" :disabled="isLoading">{{ isLoading ? '변경 중...' : '비밀번호 변경' }}</AppButton>
        </form>
      </template>

      <template v-else>
        <h1>비밀번호 변경 완료</h1>
        <p class="auth-lead">비밀번호가 정상적으로 변경되었습니다.<br>새 비밀번호로 로그인해주세요.</p>
        <div class="auth-complete-action">
          <AppButton @click="router.push('/login')">로그인하러 가기</AppButton>
        </div>
      </template>
    </div>
  </section>
</template>
