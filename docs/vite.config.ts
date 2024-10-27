/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-27 19:14:02
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-27 19:14:16
 * @FilePath: \monorepo-demo\docs\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { defineConfig } from 'vite'
import DefineOptions from 'unplugin-vue-define-options/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [DefineOptions()],
})
