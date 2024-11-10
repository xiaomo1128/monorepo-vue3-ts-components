/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-22 23:54:30
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-26 23:53:29
 * @FilePath: \monorepo-demo\play\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@zi-shui/components/icon'
import '@zi-shui/theme-chalk/src/index.scss'
import Tree from '@zi-shui/components/tree/index'
import Checkbox from '@zi-shui/components/checkbox/index'
import Button from '@zi-shui/components/button/index'
import Input from '@zi-shui/components/input/index'
import { FormItem, Form } from '@zi-shui/components/form/index'
import Upload from '@zi-shui/components/upload/index'

const plugins = [Icon, Tree, Checkbox, Button, Input, FormItem, Form, Upload]
const app = createApp(App)

// 注册为全局组件，可直接使用
plugins.forEach(plugin => {
  app.use(plugin)
})

app.mount('#app')
