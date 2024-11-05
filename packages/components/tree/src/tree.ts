/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-27 19:29:01
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-27 20:19:53
 * @FilePath: \monorepo-demo\packages\components\tree\src\tree.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ExtractPropTypes, PropType } from 'vue'

export type Key = string | number

export interface TreeNode extends Required<TreeOption> {
  level: number
  rawNode: TreeOption
  children: TreeNode[]
  isLeaf: boolean
}

export interface TreeOption {
  label?: Key
  key?: Key
  children?: TreeOption[]
  isLeaf: boolean
  [key: string]: unknown // 任意属性
}

export const treeProps = {
  // props 是只读
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
} as const

export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  },
  expanded: {
    type: Boolean,
    default: true
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>,
    required: true
  }
}

export const treeNodeEmits = {
  toggle: (node: TreeNode) => node
}

export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>
