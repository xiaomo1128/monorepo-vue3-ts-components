import { defineComponent, onBeforeMount, ref } from 'vue'
import { RangeOptions, updateType, virtualProps } from './props'
import { initVirtual } from './virtual'
import VirtualItem from './virtual-item'

export default defineComponent({
  name: 'z-virtual-scroll-list',
  props: virtualProps,
  setup(props, ctx) {
    // 默认显示30条数据，其他用 blank 占位。
    const range = ref<RangeOptions | null>(null)
    let virtual: ReturnType<typeof initVirtual> | null = null

    const update: updateType = newRange => {
      range.value = newRange
    }
    const getUniqueIdFromDataSources = () => {
      const { dataSources, dataKey } = props
      return dataSources.map(dataSource => (dataSource as any)[dataKey])
    }

    const installVirtual = () => {
      virtual = initVirtual(
        {
          keeps: props.keeps,
          buffer: Math.round(props.keeps / 3),
          uniqueIds: getUniqueIdFromDataSources(),
          estimateSize: props.estimateSize
        },
        update
      )
    }
    onBeforeMount(() => {
      // 计算start end 位移
      installVirtual()
    })

    function genRenderComponent() {
      const slots = []
      const { start, end } = range.value!
      const { dataSources, dataComponent, dataKey } = props
      for (let index = start; index < end; index++) {
        const dataSource = dataSources[index]
        const uniqueKey = (dataSource as any)[dataKey]
        if (dataSource) {
          slots.push(
            <VirtualItem
              uniqueKey={uniqueKey}
              source={dataSource}
              component={dataComponent}
              onItemResize={onItemResize}
            ></VirtualItem>
          )
        }
      }
      return slots
    }

    function onItemResize(id: string | number, size: number) {
      virtual.saveSize(id, size)
    }

    const root = ref<HTMLElement | null>(null)
    function onScroll() {
      if (root.value) {
        const offset = root.value.scrollTop
        virtual.handleScroll(offset)
      }
    }

    return () => {
      const { padFront, padBehind } = range.value!
      const paddingStyle = {
        padding: `${padFront}px 0 ${padBehind}px `
      }
      return (
        <div class="" onScroll={onScroll} ref={root}>
          <div style={paddingStyle}>{genRenderComponent()}</div>
        </div>
      )
    }
  }
})
