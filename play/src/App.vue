<!--
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-22 23:54:30
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-27 20:15:08
 * @FilePath: \monorepo-demo\play\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { AddCircle } from '@vicons/ionicons5'
import { ref } from 'vue'
// import Icon from '@zi-shui/components/icon/src/icon.vue'

// console.log(Icon);
function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(20 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      xx: createLabel(level), // 显示的内容
      key, // 为了唯一性
      children: createData(level - 1, key) // 孩子
    }
  })
}

const data = ref(createData())
</script>

<template>
  <z-icon :color="'red'" :size="20">
    <AddCircle></AddCircle>
  </z-icon>

  <z-icon :color="'blue'" :size="20">
    <AddCircle></AddCircle>
  </z-icon>

  <!-- 传递一个树形结构 -->
  <z-tree
    :data="data"
    label-field="xx"
    key-field="key"
    children-field="children"
  ></z-tree>
</template>

<style scoped></style>
