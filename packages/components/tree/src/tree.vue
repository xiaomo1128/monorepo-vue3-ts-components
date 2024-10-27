<template>
  <div>
    tree
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { TreeNode, TreeOption, treeProps } from './tree';

defineOptions({
  name: 'z-tree'
})

// 对props进行格式化，变成固定的结果
const props = defineProps(treeProps)


const tree = ref<TreeNode[]>([])

function createTree(data: TreeOption[]) {
  console.log('createTree', data);
  
}

// 监听props.data变化，格式化后重新生成树
watch(
  () => props.data,
  (data: TreeOption[]) => {
    if (data) {
      createTree(data)
    }
  },
  {
    immediate: true
  }
)
</script>
