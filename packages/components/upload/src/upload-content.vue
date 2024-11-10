<template>
  <div :class="bem.b()" @click="handleClick">
    <slot></slot>
    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadRawFile, genId } from './upload'
import { createNamespace } from '@zi-shui/utils/create'
import { uploadContentProps } from './upload-content'

const bem = createNamespace('upload')
defineOptions({
  name: 'z-upload'
})
const props = defineProps(uploadContentProps)

const inputRef = ref<HTMLInputElement>()

async function upload(file: UploadRawFile) {
  inputRef.value!.value = '' // clear input value before upload
  let result = await props.beforeUpload(file)

  if (result === false) return props.onRemove(file) // stop upload
  console.log('uploading', result)
}

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files!
  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile
    rawFile.uid = genId()

    props.onStart(rawFile)
    upload(rawFile)
  }
}
const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value?.click()
}
</script>
