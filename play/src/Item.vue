<template>
  <div class="item" style="height: 80px;">
    <div class="head">
      <span>{{ source.index }}</span>
      <span>{{ source.name }}</span>
    </div>
    <div class="body">
      <span>{{ source.desc }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  source: {
    type: Object,
    default: () => {}
  }
})
</script>
