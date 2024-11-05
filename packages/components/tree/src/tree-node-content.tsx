import { defineComponent, inject } from 'vue'
import { treeInjectKey, treeNodeContentProps } from './tree'

export default defineComponent({
  name: 'ZTreeNodeContent',
  props: treeNodeContentProps,
  setup(props) {
    const treeContext = inject(treeInjectKey)
    const { node } = props
    return () => {
      return treeContext?.slots.default
        ? treeContext?.slots.default!({
            node
          })
        : node?.label
    }
  }
})
