import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import { virtualItemProps } from './props'

export default defineComponent({
  name: 'virtual-item',
  props: virtualItemProps,
  emits: ['itemResize'],
  setup(props, { emit }) {
    return () => {
      const root = ref<HTMLElement | null>(null)
      const { component: Comp, source, uniqueKey } = props
      function dispatchEvent() {
        emit('itemResize', props.uniqueKey, root.value?.offsetHeight)
      }

      onMounted(dispatchEvent)
      onUpdated(dispatchEvent)

      return (
        Comp && (
          <div key={uniqueKey} ref={root}>
            <Comp source={source}></Comp>
          </div>
        )
      )
    }
  }
})
