import { withInstall } from '@zi-shui/utils/with-install'
import _virtual from './src/virtual'

const VirtualList = withInstall(_virtual)

export default VirtualList

declare module 'vue' {
  export interface GlobalComponents {
    ZVirtualList: typeof VirtualList
  }
}
