<template>
  <UploadContent v-bind="uploadContentProps">
    <slot></slot>
  </UploadContent>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { uploadProps } from './upload'
import UploadContent from './upload-content.vue'

const props = defineProps(uploadProps)
defineOptions({
  name: 'z-upload'
})

/**
 * props中数据是动态的，computed函数中可以获取到props中的数据
 * 去动态修改传给子级的props
 */
const uploadContentProps = computed(() => ({
  ...props,
  onStart: rawFile => {
    /** before upload */
  },
  onProgress: e => {},
  onSuccess: rawFile => {},
  onError: error => {},
  onRemove: response => {}
}))
</script>
