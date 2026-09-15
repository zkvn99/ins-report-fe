<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['confirm'])
</script>

<template>
  <section class="review-panel">
    <div class="review-header">
      <h2>검토 필요 항목</h2>
      <button class="primary" @click="emit('confirm')">검토 완료</button>
    </div>

    <div v-if="!items.length" class="empty-box">검토 항목이 없습니다.</div>

    <article v-for="item in items" :key="item.reviewId" class="review-item">
      <header>
        <div>
          <h3>{{ item.company }}</h3>
          <p>{{ item.product }}</p>
        </div>
        <span class="review-type">{{ item.type }}</span>
      </header>

      <dl>
        <div>
          <dt>원문 담보</dt>
          <dd>{{ item.riderName }}</dd>
        </div>
        <div>
          <dt>가입금액</dt>
          <dd>{{ Number(item.amountWon || 0).toLocaleString('ko-KR') }}원</dd>
        </div>
      </dl>

      <div class="review-candidates">
        <label>표준 담보</label>
        <select>
          <option v-for="candidate in item.candidates" :key="candidate.coverageId" :value="candidate.coverageId">
            {{ candidate.coverageId }} {{ candidate.name }}
          </option>
        </select>
      </div>
    </article>
  </section>
</template>
