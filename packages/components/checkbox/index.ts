import { withInstall } from '@zi-shui/utils/with-install'
import _Checkbox from './src/checkbox.vue'

const Checkbox = withInstall(_Checkbox)

declare module 'vue' {
  export interface GlobalComponents {
    ZCheckbox: typeof Checkbox
  }
}

export * from './src/checkbox'
export default Checkbox
