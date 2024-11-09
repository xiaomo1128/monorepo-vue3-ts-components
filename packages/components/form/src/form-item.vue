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
import {
  computed,
  inject,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs
} from 'vue'
import {
  Arrayable,
  FormItemContext,
  formItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState
} from './form-item'
import { FormContextKey } from './form'
import AsyncValdaitor, { Values } from 'async-validator'

defineOptions({
  name: 'z-form-item'
})
const bem = createNamespace('form-item')
const props = defineProps(formItemProps)
const formContext = inject(FormContextKey)

const validateState = ref<FormItemValidateState>('')
const validateMessage = ref('校验失败')

const converArray = (rules: Arrayable<FormItemRule> | undefined) => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

// 父级规则+自己的规则 合并
const _rules = computed(() => {
  const myRules: FormItemRule[] = converArray(props.rules) // 自己的规则

  const formRules = formContext?.rules // 父级规则
  if (formRules && props.prop) {
    const _temp = formRules[props.prop]

    if (_temp) {
      myRules.push(...converArray(_temp))
    }
  }

  return myRules
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

const onValidationSuccessed = () => {
  validateState.value = 'success'
  validateMessage.value = ''
}
const onValidationFailed = (error: Values) => {
  validateState.value = 'error'
  const { errors } = error
  validateMessage.value = errors ? errors[0].message : ''
}
const validate: FormItemContext['validate'] = async (
  trigger: string,
  callback?
) => {
  // 获取触发时机，校验是否通过调用callback Promise.then
  const rules = getRuleFiltered(trigger)
  console.log('trigger', trigger, rules, formContext?.model, props.prop)

  const modelName = props.prop!
  const validator = new AsyncValdaitor({
    [modelName]: rules
  })
  const model = formContext?.model!
  return validator
    .validate({
      [modelName]: model[modelName]
    })
    .then(() => {
      onValidationSuccessed()
    })
    .catch(err => {
      onValidationFailed(err)
      return Promise.reject(err)
    })
}
const context: FormItemContext = reactive({
  ...toRefs(props), // 具有响应式
  validate
})

provide(formItemContextKey, context)

onMounted(() => {
  formContext?.addField(context) //将自己的上下文传给父级
})
</script>
