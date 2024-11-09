import { withInstall } from '@zi-shui/utils/with-install'
import _FormItem from './src/form-item.vue'

const FormItem = withInstall(_FormItem)

export { FormItem }

export type { FormItemProps } from './src/form-item'

declare module 'vue' {
  export interface GlobalComponents {
    ZFormItem: typeof FormItem
  }
}
