import { withInstall } from '@zi-shui/utils/with-install'
import _Upload from './src/upload.vue'

const Upload = withInstall(_Upload)

export default Upload

declare module 'vue' {
  export interface GlobalComponents {
    ZUpload: typeof Upload
  }
}

export * from './src/upload'
