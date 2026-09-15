<script setup>
defineProps({
  section: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  customerName: { type: String, default: '' }
})
</script>

<template>
  <section class="page-unit">
    <article class="report-page" :data-section="section">
      <header v-if="section !== 'cover'" class="page-head">
        <span class="brand">건강자산 &amp; 보장분석</span>
        <span>{{ customerName }}</span>
      </header>

      <div v-if="section !== 'cover'" class="page-heading">
        <div class="eyebrow">{{ eyebrow }}</div>
        <h2>{{ title }}</h2>
        <p v-if="lead" class="lead">{{ lead }}</p>
      </div>

      <div class="page-body">
        <slot />
      </div>

      <footer v-if="section !== 'cover'" class="page-footer">
        <span>건강검진과 보험자료를 함께 정리한 참고자료입니다.</span>
        <b class="page-number" />
      </footer>
    </article>
  </section>
</template>
