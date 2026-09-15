<template>
  <header class="app-header screen-only">
    <RouterLink class="brand" to="/upload">건강자산 &amp; 보장분석</RouterLink>
    <nav class="app-nav" aria-label="주요 메뉴">
      <RouterLink to="/upload">자료 분석</RouterLink>
      <RouterLink to="/render">JSON 렌더링</RouterLink>
    </nav>
  </header>
  <main class="app-shell"><RouterView /></main>
</template>
