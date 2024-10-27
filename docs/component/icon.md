<!--
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-27 17:41:14
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-27 17:47:05
 * @FilePath: \monorepo-demo\docs\component\icon.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# Icon 图标

z-ui 推荐使用 xicons 作为图标库。

```
$ pnpm install @vicons/ionicons5
```

## 使用图标

- 如果你想像用例一样直接使用，你需要全局注册组件，才能够直接在项目里使用。

<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
</script>
<z-icon color="red" size="40">
  <CashOutline/>
</z-icon>

<z-icon color="green" size="40">
  <CashOutline/>
</z-icon>
<z-icon color="blue" size="40">
  <CashOutline/>
</z-icon>
<div>

<z-icon color="red" size="60">
  <CashOutline/>
</z-icon>

<z-icon color="green" size="60">
  <CashOutline/>
</z-icon>

<z-icon color="blue" size="60">
  <CashOutline/>
</z-icon>
</div>

```vue
<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
</script>
<template>
  <z-icon color="red" size="40">
    <CashOutline />
  </z-icon>
</template>
```

## API

### Icon Props

| 名称  | 类型             | 默认值    | 说明     |
| ----- | ---------------- | --------- | -------- |
| color | string           | undefined | 图标颜色 |
| size  | number \| string | undefined | 图片大小 |
