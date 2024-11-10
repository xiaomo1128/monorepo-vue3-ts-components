import { PropType, ExtractPropTypes } from 'vue'

export const calendarProps = {
  modelValue: {
    type: Date,
    required: true
  },
  range: {
    type: Array as any as PropType<[Date, Date]>
  }
} as const

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export const calendarEmits = {
  'update:modelValue': (val: Date) => val instanceof Date
}

export type CalendarEmits = typeof calendarEmits

export type CalendarDateCellType = 'prev' | 'current' | 'next'

export type CalendarDateCell = {
  text: number
  type: CalendarDateCellType
}
