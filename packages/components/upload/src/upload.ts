import { PropType, ExtractPropTypes } from 'vue'

export interface UploadFile {
  uid?: number
  name: string
  url?: string
  percentage?: number
  raw?: File
  size?: number
  status: string
}

export type UploadFiles = UploadFile[]

export const baseProps = {
  FileList: {
    type: Array as PropType<UploadFiles>,
    default: () => [] as const
  },
  action: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'file'
  },
  accept: {
    type: String,
    default: ''
  },
  //   上传文件调用ajax
  method: {
    type: String,
    default: 'post'
  },
  headers: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  },
  drag: {
    type: Boolean,
    default: false
  }
} as const

export type UploadRawFile = File & { uid: number }
export type UploadProgressEvent = ProgressEvent & { pecentage: number }
const NOOP = () => {}
export const uploadProps = {
  ...baseProps,
  // 预览时，该回调可获取上次文件
  onPreview: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  beforeUpload: {
    type: Function as PropType<
      (file: UploadRawFile) => boolean | Promise<boolean>
    >,
    default: NOOP
  },
  onChange: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  beforeRemove: {
    type: Function as PropType<
      (file: UploadFile, uploadFiles: UploadFiles) => Promise<boolean> | boolean
    >,
    default: NOOP
  },
  onRemove: {
    type: Function as PropType<
      (file: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  },
  onProgress: {
    type: Function as PropType<
      (
        file: UploadProgressEvent,
        uploadFile: UploadFile,
        uploadFiles: UploadFiles
      ) => void
    >,
    default: NOOP
  },
  onSuccess: {
    type: Function as PropType<
      (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  },
  onError: {
    type: Function as PropType<
      (err: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
    >,
    default: NOOP
  }
} as const

export type UploadProps = ExtractPropTypes<typeof uploadProps>

let id = 0
export const genId = () => id++
