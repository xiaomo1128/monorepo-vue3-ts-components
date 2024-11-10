<template>
  <div :class="bem.b()" @click="handleClick">
    <template v-if="drag">
      <UploadDragger @file="uploadFiles">
        <slot></slot>
      </UploadDragger>
    </template>

    <template v-else>
      <slot></slot>
    </template>

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
import { httpRequest } from './ajax'
import UploadDragger from './upload-dragger.vue'

const bem = createNamespace('upload')
defineOptions({
  name: 'z-upload',
  inheritAttrs: false
})
const props = defineProps(uploadContentProps)

const inputRef = ref<HTMLInputElement>()

async function upload(rawFile: UploadRawFile) {
  inputRef.value!.value = '' // clear input value before upload
  let result = await props.beforeUpload(rawFile)

  if (result === false) return props.onRemove(rawFile) // stop upload

  // ajax处理上传逻辑
  const { method, name, action, headers, data } = props
  httpRequest({
    method,
    name,
    action,
    headers,
    data,
    file: rawFile,
    onProgress: e => {
      props.onProgress(e, rawFile)
    },
    onError: e => {
      props.onError(e, rawFile)
    },
    onSuccess: res => {
      props.onSuccess(res, rawFile)
    }
  })
}

function uploadFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile
    rawFile.uid = genId()

    props.onStart(rawFile)
    upload(rawFile)
  }
}
const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files!
  uploadFiles(files)
}
const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value?.click()
}
</script>
