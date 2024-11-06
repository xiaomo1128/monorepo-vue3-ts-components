<template>
  <div :class="bem.b()">
    <!-- 若自定义性强，采用tsx编写 -->
    <z-virtual-list :items="flattenTree" :remain="8" :size="35">
      <template #default="{ node }">
        <z-tree-node :key="node.key" :node="node" :expanded="isExpanded(node)" :loadingKeys="loadingKeysRef"
          :selectedKeys="selectedKeysRef" @select="handleSelect" @toggle="toggleExpand" :show-checkbox="showCheckbox"
          :checked="isChecked(node)" :disabled="isDisabled(node)" :Indeterminate="isIndeterminate(node)"
          @check="toggleCheck"></z-tree-node>
      </template>
    </z-virtual-list>

    <!-- <z-tree-node v-for="node in flattenTree" :key="node.key" :node="node" :expanded="isExpanded(node)"
      :loadingKeys="loadingKeysRef" :selectedKeys="selectedKeysRef" @select="handleSelect"
      @toggle="toggleExpand"></z-tree-node> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue';
import { Key, TreeNode, TreeOption, treeEmits, treeInjectKey, treeProps } from './tree';
import { createNamespace } from '@zi-shui/utils/create';
import ZTreeNode from './treeNode.vue'
import ZVirtualList from '@zi-shui/components/virtual-list'

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
        disabled: !!node.disabled, // 是否禁用
        // 是否叶子节点,若没有则查看是否有children属性
        isLeaf: node.isLeaf ?? children.length === 0,
        parentKey: parent?.key, // 父节点key
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

provide(treeInjectKey, {
  slots: useSlots(),
})

const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))

function isChecked(node: TreeNode): boolean {
  return checkedKeysRefs.value.has(node.key)
}

function isDisabled(node: TreeNode): boolean {
  return !!node.disabled
}

const indeterminateRefs = ref<Set<Key>>(new Set())
function isIndeterminate(node: TreeNode): boolean {
  return indeterminateRefs.value.has(node.key)
}

// 自上而下选中
function toggle(node: TreeNode, checked: boolean) {
  if (!node) return
  let checkedKeys = checkedKeysRefs.value

  if (checked) {
    // 选中时，去掉半选状态
    indeterminateRefs.value.delete(node.key)
  }
  // 维护当前key列表
  checkedKeys[checked ? 'add' : 'delete'](node.key)

  const children = node.children || []
  if (children.length) {
    children.forEach(child => {
      if (!child.disabled) {
        toggle(child, checked)
      }
    })
  }
}

function findNode(key: Key) {
  return flattenTree.value.find(node => node.key === key)
}

function updateCheckedKeys(node: TreeNode) {
  // 自下而上更新
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey)
    if (parentNode) {
      let allChecked = true // 是否全部选中
      let hasChecked = false // 是否有选中

      let nodes = parentNode.children || []
      for (const node of nodes) {
        if (checkedKeysRefs.value.has(node.key)) {
          hasChecked = true // 存在选中
        } else if (indeterminateRefs.value.has(node.key)) {
          allChecked = false // 存在半选
          hasChecked = true // 存在选中
        } else {
          allChecked = false // 存在半选
        }
      }
      if (allChecked) {
        // 全部选中
        checkedKeysRefs.value.add(parentNode.key)
        indeterminateRefs.value.delete(parentNode.key)
      } else if (hasChecked) {
        // 存在选中
        indeterminateRefs.value.add(parentNode.key)
        checkedKeysRefs.value.delete(parentNode.key)
      }
      updateCheckedKeys(parentNode)
    }
  }
}

function toggleCheck(node: TreeNode, checked: boolean) {
  toggle(node, checked)
  updateCheckedKeys(node)
}

onMounted(() => {
  checkedKeysRefs.value.forEach(key => {
    toggle(findNode(key)!, true)
  })
})
</script>
