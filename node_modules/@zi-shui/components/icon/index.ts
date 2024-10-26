/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-23 09:59:56
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-26 23:17:12
 * @FilePath: \monorepo-demo\packages\components\icon\index.ts
 * @Description: 整合组件，最终实现导出组件
 */


import _Icon from './src/icon.vue'
import { withInstall } from '@zi-shui/utils/with-install'

const Icon = withInstall(_Icon);

export default Icon; //既可以app.use使用，也可import单独使用

export * from './src/icon'

// 此处添加的类型，可在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    ZIcon: typeof Icon
  }
}