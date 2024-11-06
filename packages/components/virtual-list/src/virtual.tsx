import { createNamespace } from '@zi-shui/utils/create'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'

export default defineComponent({
  name: 'ZVirtualList',
  props: {
    size: {
      type: Number,
      default: 35
    },
    remain: {
      default: 8,
      type: Number
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { slots }) {
    const bem = createNamespace('vl')
    const wrapperRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()
    //计算显示区域
    const state = reactive({
      start: 0,
      end: props.remain
    })

    const prev = computed(() => {
      // 当前开始第四条
      return Math.min(state.start, props.remain)
    })

    const next = computed(() => {
      // 当前结束第四条
      return Math.min(props.remain, props.items.length - state.end)
    })

    // 应该多展示，上8条+下8条，保证用户快速滚动时，不会白屏
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    const offset = ref(0)

    const handleScroll = () => {
      // 根据当前滚动的距离，计算未显示的数据区域
      const scrollTop = wrapperRef.value!.scrollTop
      state.start = Math.floor(scrollTop / props.size) //滑动后未显示的区域
      state.end = state.start + props.remain //滑动后显示的区域

      offset.value = state.start * props.size - props.size * prev.value //滚动的个数
    }

    function initWrapper() {
      wrapperRef.value!.style.height = props.remain * props.size + 'px'
      barRef.value!.style.height = props.items.length * props.size + 'px'
    }

    watch(() => props.items, initWrapper)

    onMounted(() => {
      initWrapper()
    })
    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
          {/* 模拟总长度 */}
          <div class={bem.e('scroll-bar')} ref={barRef}></div>
          {/* 更新列表从哪显示到哪，一直只展示8条 */}
          <div
            class={bem.e('scroll-list')}
            style={{
              transform: `translate3d(0,${offset.value}px,0)`,
              color: 'red'
            }}
          >
            {visibleData.value.map((node, idx) =>
              slots.default!({ node, idx })
            )}
          </div>
        </div>
      )
    }
  }
})
