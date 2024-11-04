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

function createOptions(key: string, label: string, children: string) {
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
    }
  },
  {
    immediate: true
  }
)

// 平铺，点击展开
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))

const flattenTree = computed(() => {
  let expandedKeys = expandedKeysSet.value // 要展开的节点

  let flattenNodes: TreeNode[] = [] // 平铺后的节点

  const nodes = tree.value || []// 格式化后的树形数据

  const stack: TreeNode[] = [] // 栈

  for (let i = nodes.length - 1; i >= 0; i--) {
    stack.push(nodes[i])
  }
  // 深度遍历
  while (stack.length) {
    const node = stack.pop()
    if (!node) continue
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      const children = node.children || []
      if (children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i])
        }
      }
    }
  }

  return flattenNodes
})
console.log(flattenTree.value);

</script>
