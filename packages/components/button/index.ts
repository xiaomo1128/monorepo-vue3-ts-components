import { withInstall } from '@zi-shui/utils/with-install'
import _Button from './src/button.vue'

const Button = withInstall(_Button)

export type { ButtonProps } from './src/button'

export default Button

declare module 'vue' {
  export interface GlobalComponents {
    ZButton: typeof Button
  }
}
