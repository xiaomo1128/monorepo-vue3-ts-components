/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-22 23:54:30
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-26 23:14:08
 * @FilePath: \monorepo-demo\play\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@zi-shui/components/icon'

const plugins = [
    Icon
]
const app = createApp(App)

// 注册为全局组件，可直接使用
plugins.forEach(plugin => {
    app.use(plugin)
})

app.mount('#app')
