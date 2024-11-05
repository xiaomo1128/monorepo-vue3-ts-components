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
import { TreeOption } from '@zi-shui/components/tree';
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

// function createData(level = 4, parentKey = ''): any {
//   if (!level) return []
//   const arr = new Array(20 - level).fill(0)
//   return arr.map((_, idx: number) => {
//     const key = parentKey + level + idx
//     return {
//       xx: createLabel(level), // 显示的内容
//       key, // 为了唯一性
//       children: createData(level - 1, key) // 孩子
//     }
//   })
// }

function createData() {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false, // 动态加载子节点
    }, {
      label: nextLabel(),
      key: 2,
      isLeaf: false,
    }
  ]
}

function nextLabel(currentLabel?: string | undefined | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

const data = ref(createData())

function handleLoad(node: TreeOption) { 
  // 异步加载子节点
  return new Promise<TreeOption[]>((resolve) => {
    setTimeout(() => {
      resolve([ // 当前展开node的children属性 
        { 
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false, // 动态加载子节点
        }
      ])
    }, 1000);
  })
}
</script>

<template>
  <z-icon :color="'red'" :size="20">
    <AddCircle></AddCircle>
  </z-icon>

  <z-icon :color="'blue'" :size="20">
    <AddCircle></AddCircle>
  </z-icon>

  <!-- 传递一个树形结构 -->
   <z-tree :data="data" :on-load="handleLoad"></z-tree>
  <!-- <z-tree :data="data" label-field="label" key-field="key" children-field="children"></z-tree> -->
</template>

<style scoped></style>
