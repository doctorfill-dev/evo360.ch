<template>
  <div class="site-wrapper">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss">
.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
