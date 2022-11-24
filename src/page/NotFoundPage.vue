<template>
  <div class="not-found-page">
    <div class="message-box">
      <div class="main-text">
        <div id="text-1">4</div>
        <div id="text-2">0</div>
        <div id="text-3">4</div>
      </div>
      <p class="description">{{ $t('error.resourceNotFound') }}</p>

      <div class="actions">
        <button @click="$router.back()">{{ $t('button.back') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
};
</script>

<style scoped lang="scss">
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
}

.message-box {
  text-align: center;
}

.main-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  line-height: 1.1;
  font-weight: bold;
  color: #4caf50;

  div:nth-child(2) {
    color: #f1873f;
  }
}

.description {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0.7rem 0 0.9rem;
}

.actions {
  button {
    color: #4caf50;
  }
}

#text-1,
#text-2,
#text-3 {
  animation: float 1s infinite ease-in-out alternate;
}
#text-2 {
  animation-delay: 0.2s;
}
#text-3 {
  animation-delay: 0.4s;
}

@keyframes float {
  100% {
    transform: translateY(20px);
  }
}
</style>
