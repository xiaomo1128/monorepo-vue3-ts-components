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

function createOptions(key: string, label: string, children:string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    }
  }
}

const treeOptions = createOptions(props.keyField, props.labelField, props.childrenField)

function createTree(data: TreeOption[]) {
  console.log('createTree', data);
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map((node) => {
      let children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [], //默认空数组
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? children.length === 0,// 是否叶子节点
      }
      if (children.length > 0) {  
        // 子级有数据，将其格式化为treeNode
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  const result: TreeNode[] = traversal(data)
  return result
}

// 监听props.data变化，格式化后重新生成树
watch(
  () => props.data,
  (data: TreeOption[]) => {
    if (data) {
      tree.value = createTree(data)
      console.log('树形数据',tree.value);
      
    }
  },
  {
    immediate: true
  }
)
</script>
