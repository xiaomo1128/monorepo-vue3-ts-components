<template>
  <div :class="[bem.b()]">
    <div :class="bem.e('group')">
      <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
        <slot name="prepend"></slot>
      </div>

      <div :class="[bem.e('wrapper')]">
        <span v-if="slots.prefixIcon" :class="bem.e('prefix')">
          <slot name="prefixIcon"></slot>
        </span>

        <!-- 若需要显示密码 当前是文本or密码切换 -->
        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          v-bind="attrs"
          :class="bem.e('inner')"
          ref="input"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
        />

        <span v-if="slots.suffixIcon" :class="bem.e('suffix')">
          <z-icon v-if="showPwdVisible" @click="handlePasswordVisible"
            >e</z-icon
          >
          <z-icon v-if="showClear" @click="clear">X</z-icon>

          <!-- <slot v-else name="suffixIcon"></slot> -->
        </span>
      </div>

      <div v-if="slots.append" :class="bem.be('group', 'append')">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@zi-shui/utils/create'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch
} from 'vue'
import { inputEmits, inputProps } from './input'

defineOptions({
  name: 'z-input',
  inheritAttrs: false
})
const bem = createNamespace('input')
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

const attrs = useAttrs()
const slots = useSlots()
/********************************************* */
// 监听modelValue变化，更新input的value
watch(
  () => props.modelValue,
  () => {
    setNativeInputValue()
  }
)
const input = ref<HTMLInputElement | null>(null)
const setNativeInputValue = () => {
  const inputEle = input.value
  if (!inputEle) return

  inputEle.value = String(props.modelValue)
}
onMounted(() => {
  // 组件加载完后，设置input的value
  setNativeInputValue()
})
/********************************************* */
const focus = async () => {
  await nextTick() // 等待input渲染完成 重新获取焦点
  input.value?.focus()
}
const passwordVisible = ref(false)
const showPwdVisible = computed(() => {
  return (
    props.modelValue && props.showPassword && !props.disabled && !props.readonly
  )
})
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
  focus()
}
/********************************************* */
const showClear = computed(() => {
  return (
    props.modelValue && props.clearable && !props.disabled && !props.readonly
  )
})

const clear = () => {
  emit('input', '')
  emit('update:modelValue', '')
  emit('clear')
  focus()
}
/********************************************* */
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('input', value)
  emit('update:modelValue', value) // 兼容v-model 双向绑定
}

const handleChange = (e: Event) => {
  emit('change', (e.target as HTMLInputElement).value)
}

const handleBlur = (e: FocusEvent) => {
  emit('blur', e)
}
const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}
/********************************************* */
</script>
