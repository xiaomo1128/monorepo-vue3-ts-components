<template>
  <div
    @dragover.prevent="onDragover"
    @dragleave.prevent="isOver = false"
    @drop.prevent="onDrop"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOver = ref(false)
const emit = defineEmits({})

const onDrop = (e: Event) => {
  e.stopPropagation()
  emit('file', Array.from(e.dataTransfer!.files))
}
const onDragover = function () {
  isOver.value = true
}
</script>
