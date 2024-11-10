<template>
  <UploadContent v-bind="uploadContentProps">
    <slot></slot>
  </UploadContent>

  {{ uploadFiles }}
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { UploadFile, UploadFiles, UploadRawFile, uploadProps } from './upload'
import UploadContent from './upload-content.vue'

const props = defineProps(uploadProps)
const emit = defineEmits({})
defineOptions({
  name: 'z-upload'
})

const uploadFiles = ref<UploadFiles>(props.FileList)
watch(uploadFiles, newV => { // 监听上传文件列表变化
  emit('onUpdate:file-list', newV)
})

const findFile = (rawFile: UploadRawFile) => {
  return uploadFiles.value.find(file => file.uid === rawFile.uid)
}

/**
 * props中数据是动态的，computed函数中可以获取到props中的数据
 * 去动态修改传给子级的props
 */
const uploadContentProps = computed(() => ({
  ...props,
  onStart: rawFile => {
    /** before upload */
    console.log('start upload')
    const uploadFile: UploadFile = {
      uid: rawFile.uid,
      name: rawFile.name,
      percentage: 0,
      raw: rawFile,
      size: rawFile.size,
      status: 'start'
    }
    uploadFile.url = URL.createObjectURL(rawFile) // 预览用
    uploadFiles.value = [...uploadFiles.value, uploadFile]
    props.onChange(uploadFile)
  },
  onProgress: (e, rawFile) => {
    console.log('upload progress')
    const uploadFile = findFile(rawFile)!
    uploadFile.status = 'uploading'
    uploadFile.percentage = e.percent
    props.onProgress(e, uploadFile, uploadFiles.value)
  },
  onRemove: async rawFile => {
    console.log('remove file')
    const uploadFile = findFile(rawFile)!
    const r = await props.beforeRemove(uploadFile, uploadFiles.value)
    if (r != false) {
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(uploadFile), 1)
      props.onRemove(uploadFile, uploadFiles.value)
    }
  },
  onError: (error, rawFile) => {
    console.log('upload error')
    const uploadFile = findFile(rawFile)!
    uploadFile.status = 'error'
    const fileList = uploadFiles.value
    fileList.splice(fileList.indexOf(uploadFile), 1)
    props.onError(error, uploadFile, fileList)
  },
  onSuccess: (response, rawFile) => {
    const uploadFile = findFile(rawFile)!
    uploadFile.status = 'success'
    const fileList = uploadFiles.value
    props.onSuccess(response, uploadFile, fileList)
  }
}))
</script>
