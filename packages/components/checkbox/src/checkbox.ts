import { t } from 'unplugin-vue-define-options/index.d-CEU5siLz'
import { ExtractPropTypes, PropType } from 'vue'

export const checkboxProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>
  },
  indeterminate: {
    type: Boolean
  },
  disabled: Boolean,
  label: {
    type: String as PropType<string>
  }
} as const

export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>

export const checkboxEmits = {
  'update:modelValue': (value: boolean | string | number) => typeof value === 'boolean',
  change: (value: boolean | string | number) => typeof value === 'boolean'
}

export type CheckboxEmits = typeof checkboxEmits
