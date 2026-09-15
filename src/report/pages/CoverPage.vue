<script setup>
import ReportPage from '../components/ReportPage.vue'
</script>

<template>
  <ReportPage section="cover">
    <div class="cover-page">
      <div class="cover-brand">오늘의 건강, 내일의 안심</div>
      <div class="cover-date">{{ reportDate }}</div>
      <div class="cover-mark">+</div>
      <div class="cover-title-block">
        <div class="cover-name">{{ customer.name }} 님의</div>
        <h1>건강자산 &amp; 보장분석</h1>
        <i />
        <p>최근 건강검진 기록과 보유 보험을 함께 살펴보고<br>앞으로 확인할 건강·보장 방향을 정리했습니다.</p>
      </div>
      <dl class="cover-meta">
        <div><dt>연령</dt><dd>{{ customer.age }}세</dd></div>
        <div><dt>최근 검진일</dt><dd>{{ checkupDate || '자료 없음' }}</dd></div>
        <div><dt>가입 계약</dt><dd>{{ contractCount }}건</dd></div>
      </dl>
      <div class="cover-flow"><span>건강 상태</span><b>→</b><span>보장 자산</span><b>→</b><span>관리 방향</span></div>
    </div>
  </ReportPage>
</template>

<script>
export default {
  props: {
    customer: { type: Object, required: true },
    reportDate: { type: String, required: true },
    checkupDate: { type: String, default: null },
    contractCount: { type: Number, default: 0 }
  }
}
</script>
