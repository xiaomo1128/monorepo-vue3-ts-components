import { ExtractPropTypes, PropType } from 'vue'
import {
  UploadProgressEvent,
  UploadRawFile,
  baseProps,
  uploadProps
} from './upload'

const NOOP = () => {}
export const uploadContentProps = {
  ...baseProps,
  beforeUpload: uploadProps['beforeUpload'],
  onStart: {
    type: Function as PropType<(rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onProgress: {
    type: Function as PropType<
      (e: UploadProgressEvent, rawFile: UploadRawFile) => void
    >,
    default: NOOP
  },
  onSuccess: {
    type: Function as PropType<(response: any, rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onError: {
    type: Function as PropType<(error: Error, rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onRemove: {
    type: Function as PropType<(rawFile: UploadRawFile) => void>,
    default: NOOP
  }
} as const

export type UploadContentProps = ExtractPropTypes<typeof uploadContentProps>

export interface RequestOptions {
  method: string
  file: File
  name: string
  action: string
  headers: Headers | Record<string, any>
  data: Record<string, any>
  onError: (error: any) => void
  onSuccess: (response: any) => void
  onProgress: (event: UploadProgressEvent) => void
}
