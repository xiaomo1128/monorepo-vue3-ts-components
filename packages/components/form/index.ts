import { withInstall } from '@zi-shui/utils/with-install'
import _FormItem from './src/form-item.vue'
import _Form from './src/form.vue'

const FormItem = withInstall(_FormItem)
const Form = withInstall(_Form)

export { FormItem, Form }

export type { FormItemProps } from './src/form-item'
export type { FormProps } from './src/form'

export type FormInstance = InstanceType<typeof Form>
declare module 'vue' {
  export interface GlobalComponents {
    ZFormItem: typeof FormItem
    ZForm: typeof Form
  }
}
