/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-27 19:04:48
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-27 19:14:58
 * @FilePath: \monorepo-demo\docs\.vitepress\theme\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import DefaultTheme from 'vitepress/theme'

import ZIcon from '@zi-shui/components/icon'
import '@zi-shui/theme-chalk/src/index.scss'

console.log(ZIcon);
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ZIcon) // 在vitepress的app实例上全局注册ZIcon组件
  }
}
