<template>
  <div
    :class="[
      bem.b(),
      bem.is('success', validateState === 'success'),
      bem.is('error', validateState === 'error')
    ]"
  >
    <label :class="bem.e('label')">
      <slot name="label">
        {{ label }}
      </slot>
    </label>

    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error')">
        <slot name="error">
          {{ validateMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@zi-shui/utils/create'
import { computed, provide, reactive, ref, toRefs } from 'vue'
import {
  FormItemContext,
  formItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState
} from './form-item'

defineOptions({
  name: 'z-form-item'
})
const bem = createNamespace('form-item')

const props = defineProps(formItemProps)

const validateState = ref<FormItemValidateState>('')
const validateMessage = ref('校验失败')

const _rules = computed(() => {
  const rules: FormItemRule[] = props.rules
    ? Array.isArray(props.rules)
      ? props.rules
      : [props.rules]
    : []
  return rules
})

const getRuleFiltered = (trigger: string) => {
  // blur change ''
  const rules = _rules.value

  return rules.filter(rule => {
    if (!rule.trigger || !trigger) return true // 无触发时机，默认触发校验
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}
const validate: FormItemContext['validate'] = async (
  trigger: string,
  callback?
) => {
  // 获取触发时机，校验是否通过调用callback Promise.then
  const rules = getRuleFiltered(trigger)
  console.log('trigger', trigger, rules)
}
const context: FormItemContext = reactive({
  ...toRefs(props), // 具有响应式
  validate
})

provide(formItemContextKey, context)
</script>
