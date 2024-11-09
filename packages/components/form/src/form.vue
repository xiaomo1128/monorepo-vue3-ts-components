<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>

<script lang="ts" setup>
import { createNamespace } from '@zi-shui/utils/create'
import { FormContext, FormContextKey, formProps } from './form'
import { provide } from 'vue'
import { FormItemContext } from './form-item'
import { Values } from 'async-validator'

defineOptions({
  name: 'z-form'
})
const bem = createNamespace('form')
const props = defineProps(formProps)

// form校验，父级调用所有子级校验方法
const validate = async (
  callback?: (valid: boolean, fields?: Values) => void
) => {
  let errors: Values = {}
  for (let field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields
      }
    }
  }
  //   没有错误就成功
  if (Object.keys(errors).length === 0) {
    return callback?.(true)
  } else {
    // 有错误 即失败
    if (callback) {
      callback(false, errors)
    } else {
      return Promise.reject(errors)
    }
  }
}

const fields: FormItemContext[] = [] //父级收集子级
const addField: FormContext['addField'] = context => {
  fields.push(context)
}

const context = {
  ...props,
  addField
}
provide(FormContextKey, context)

// 将form表单的校验方法 暴露给用户，用户可以通过ref来进行检测
defineExpose({
  validate
})
</script>
