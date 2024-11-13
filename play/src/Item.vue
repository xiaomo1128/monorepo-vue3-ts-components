<template>
  <div class="item"  :data-index="source.index">
    <div class="head">
      <span>{{ source.index }}</span>
      <span>{{ source.name }}</span>
    </div>
    <div class="body" style="font-size: 18px">
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
