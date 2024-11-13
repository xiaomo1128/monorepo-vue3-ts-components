import { DefineComponent, ExtractPropTypes, PropType } from 'vue'

export const virtualProps = {
  dataSources: {
    type: Array,
    required: true,
    default: () => []
  },
  dataKey: {
    type: String,
    required: true
  },
  keeps: {
    type: Number,
    default: 30
  },
  estimateSize: {
    type: Number,
    default: 80
  },
  dataComponent: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>,
    required: true
  }
} as const

export type VirtualProps = ExtractPropTypes<typeof virtualProps>

export type RangeOptions = {
  start: number
  end: number
  padFront: number
  padBehind: number
}

export type VirtualOptions = {
  keeps: number
  buffer: number
  estimateSize: number
  uniqueIds: string[]
}

export type updateType = (range: RangeOptions) => void

export const virtualItemProps = {
  uniqueKey: {
    type: [String, Number] as PropType<string | number>
  },
  source: {
    type: Object,
    required: true
  },
  component: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>
  }
} as const

export type VirtualItemProps = ExtractPropTypes<typeof virtualItemProps>
