import { UploadProgressEvent } from './upload'
import { RequestOptions } from './upload-content'

export function httpRequest(options: RequestOptions) {
  const xhr = new XMLHttpRequest()
  const action = options.action

  xhr.open(options.method, action, true)

  xhr.upload.addEventListener('progress', e => {
    // 加载总数 + 已经加载的
    const processEvents = e as UploadProgressEvent
    processEvents.pecentage = e.total > 0 ? (e.loaded / e.total) * 100 : 0

    options.onProgress(processEvents) // 上传进度
  })

  // 设置请求头
  const headers = options.headers
  if (headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value)
    }
  }

  // 设置请求 body
  const formData = new FormData()
  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      formData.append(key, value)
    }
  }
  formData.append(options.name, options.file)

  xhr.onload = function () {
    if (xhr.status < 300 && xhr.status >= 200) {
      options.onSuccess(xhr.response) // 上传成功
    } else {
      options.onError({ status: xhr.status }) // 上传失败
    }
  }

  xhr.addEventListener('error', function (err) {
    options.onError(err) // 上传失败
  })

  xhr.send(formData)
  return xhr
}
