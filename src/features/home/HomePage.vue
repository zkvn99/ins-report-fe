<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../auth/authSession.js'
import AppButton from '../../shared/components/AppButton.vue'

const router = useRouter()
const guideCards = [
  { number: '01', title: '보험사 보장분석 PDF 업로드', text: '가입한 보험의 보장 내용을 한곳에 모읍니다.' },
  { number: '02', title: '국민건강보험공단 건강검진 PDF 업로드', text: '건강검진 결과를 분석의 기준으로 연결합니다.' },
  { number: '03', title: '기준표 Excel 업로드', text: '필요한 보장 기준을 분석에 함께 반영합니다.' },
  { number: '04', title: '건강 × 보장 통합 리포트 생성', text: '어디가, 왜 부족한지 한눈에 확인합니다.' }
]

function startAnalysis() {
  router.push(isAuthenticated.value ? '/upload' : '/login?redirect=/upload')
}
</script>

<template>
  <section class="home-page">
    <div class="home-hero">
      <p class="home-kicker">HEALTH × COVERAGE</p>
      <h1>보험이 부족합니다가 아니라<br><em>어디가, 왜 부족한지</em> 보여주세요.</h1>
      <p class="home-lead">건강검진과 보험 보장을 함께 분석해<br>지금 필요한 판단의 근거를 만듭니다.</p>
      <div class="home-brand">MEDICOVER <span>매디커버</span></div>
    </div>
    <div class="home-guide">
      <div class="section-heading">
        <p class="home-kicker">HOW IT WORKS</p>
        <h2>세 가지 자료로 시작하는<br>나만의 통합 분석</h2>
      </div>
      <div class="guide-grid">
        <article v-for="card in guideCards" :key="card.number" class="guide-card">
          <span>{{ card.number }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
        </article>
      </div>
      <AppButton class="home-cta" size="lg" @click="startAnalysis">매디커버 실행 <span>→</span></AppButton>
    </div>
  </section>
</template>