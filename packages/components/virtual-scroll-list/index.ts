export type { VirtualProps } from './src/props'

import { withInstall } from '@zi-shui/utils/with-install'
import _VirtualList from './src/virtual-list'

const VirtualList = withInstall(_VirtualList)

export default VirtualList

declare module 'vue' {
  export interface GlobalComponents {
    ZVirtualScrollList: typeof VirtualList
  }
}





