<template>
  <div :class="bem.b()">
    <!-- 若自定义性强，采用tsx编写 -->
    <z-tree-node v-for="node in flattenTree" :key="node.key" :node="node" :expanded="isExpanded(node)"
      :loadingKeys="loadingKeysRef" :selectedKeys="selectedKeysRef" @select="handleSelect"
      @toggle="toggleExpand"></z-tree-node>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Key, TreeNode, TreeOption, treeEmits, treeProps } from './tree';
import { createNamespace } from '@zi-shui/utils/create';
import ZTreeNode from './treeNode.vue'

const bem = createNamespace('tree');

defineOptions({
  name: 'z-tree'
})

// 对props进行格式化，变成固定的结果
const props = defineProps(treeProps)


const tree = ref<TreeNode[]>([])

// 获取对应字段
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

// 格式化数据
function createTree(data: TreeOption[], parent: TreeNode | null = null) {
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
  const result: TreeNode[] = traversal(data, parent)
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

// 将树形结构，平铺，展开的节点动态计算
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

function isExpanded(node: TreeNode): boolean {
  return expandedKeysSet.value.has(node.key)
}

function collapse(node: TreeNode) {
  expandedKeysSet.value.delete(node.key)
}

const loadingKeysRef = ref(new Set<Key>())

function triggerLoading(node: TreeNode) {
  // 该节点要异步加载
  if (!node.children.length && !node.isLeaf) {
    // 若没有加载过，则触发异步加载
    let loadingKeys = loadingKeysRef.value
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      const onLoad = props.onLoad
      if (onLoad) {
        onLoad(node.rawNode).then((children) => {
          // 修改原来的节点
          node.rawNode.children = children
          // 更新自定义node
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        })
      }
    }
  }
}

function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.key)

  // 展示子节点处理逻辑
  triggerLoading(node)
}

// 点击展开
function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value
  // 若当前节点
  if (expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collapse(node)
  } else {
    expand(node)
  }
}

// 选中节点
const emit = defineEmits(treeEmits)

const selectedKeysRef = ref<Key[]>([])

watch(
  () => props.selectedKeys,
  value => {
    if (value) {
      selectedKeysRef.value = value
    }
  },
  {
    immediate: true
  }
)

function handleSelect(node: TreeNode) {
  let keys = Array.from(selectedKeysRef.value)

  if (!props.selectable) return // 不可选

  if (props.multiple) {
    // 多选
    // 取消选中
    let index = keys.findIndex(k => k === node.key)
    if (index !== -1) {
      keys.splice(index, 1)
    } else {
      keys.push(node.key)
    }
  } else {
    // 单选
    if (keys.includes(node.key)) {
      // 取消选中
      keys = []
    } else {
      // 选中
      keys = [node.key]
    }
  }
  emit('update:selectedKeys', keys)
}

</script>
