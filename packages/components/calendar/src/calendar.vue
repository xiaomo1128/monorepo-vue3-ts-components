<template>
  <div :class="cal.b()">
    <div :class="cal.e('header')">
      <div :class="cal.e('title')">{{ currentDate }}</div>
      <div :class="cal.e('button-group')">
        <z-button @click="selectDate('prev-year')">前一年</z-button>
        <z-button @click="selectDate('prev-month')">上个月</z-button>
        <z-button @click="selectDate('today')">今天</z-button>
        <z-button @click="selectDate('next-month')">下个月</z-button>
        <z-button @click="selectDate('next-year')">下一年</z-button>
      </div>
    </div>

    <div :class="cal.e('body')">
      <table :class="calTable.b()" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="day in weekDays">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rid) in rows" :key="rid">
            <td
              v-for="(cell, cid) in row"
              :key="cid"
              :class="[calDay.b(), getCellClass(cell)]"
              @click="handlePick(cell)"
            >
              <slot name="date-cell" :data="getSlotData(cell)">
                {{ cell.text }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create'
import ZButton from '@zi-shui/components/button'
import dayjs, { Dayjs } from 'dayjs'
import { computed, ref } from 'vue'
import {
  CalendarDateCell,
  CalendarDateCellType,
  CalendarDateType,
  calendarEmits,
  calendarProps
} from './calendar'

const props = defineProps(calendarProps)
const now = dayjs() // 当前日期
// 根据用户属性计算当前日期
const date = computed(() => {
  if (!props.modelValue) {
    return now
  } else {
    return dayjs(props.modelValue)
  }
})
const cal = createNamespace('calendar')
const calTable = createNamespace('calendar-table')
const calDay = createNamespace('calendar-day')
defineOptions({
  name: 'z-calendar'
})

const firstDayOfWeek = dayjs().startOf('week').day()

const weekMaping = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]

const weekDays = computed(() => {
  return [
    ...weekMaping.slice(firstDayOfWeek),
    ...weekMaping.slice(0, firstDayOfWeek)
  ]
})

const rows = computed(() => {
  // 根据用户提供的日期，计算42个
  let list: CalendarDateCell[] = []
  // 获取本月第一天是星期几
  const firstDay = date.value.startOf('month').day()

  const lastDay = date.value.subtract(1, 'month').endOf('month').date()

  const count = firstDay - firstDayOfWeek // 计算本月前面空余的天数

  // 获取本月的天数
  const prevMonthDays: CalendarDateCell[] = Array.from({ length: count })
    .map((_, idx) => lastDay - (count - idx - 1))
    .map(_ => ({
      text: _,
      type: 'prev'
    }))

  // 获取本月的天数
  const days = date.value.daysInMonth()
  const currentMonthDays: CalendarDateCell[] = Array.from({ length: days }).map(
    (_, idx) => ({
      text: idx + 1,
      type: 'current'
    })
  )
  list = [...prevMonthDays, ...currentMonthDays]

  let remaning = 42 - list.length
  const nextMonthDays: CalendarDateCell[] = Array.from({ length: remaning })
    .map((_, idx) => idx + 1)
    .map(_ => ({
      text: _,
      type: 'next'
    }))
  list = [...list, ...nextMonthDays]
  return Array.from({ length: 6 }).map((_, idx) => {
    const start = idx * 7
    return list.slice(start, start + 7)
  })
})

const prevMonthDay = computed(() => date.value.subtract(1, 'month').date(1))
const nextMonthDay = computed(() => date.value.add(1, 'month').date(1))
const prevYearDay = computed(() => date.value.subtract(1, 'year').date(1))
const nextYearDay = computed(() => date.value.add(1, 'year').date(1))
const emit = defineEmits(calendarEmits)
function pickDay(day: Dayjs) {
  selectDay.value = day // 暂存选中的日期
  // v-model = modelValue+ @update:modelValue
  emit('update:modelValue', day.toDate())
}

function selectDate(type: CalendarDateType) {
  // 策略优化
  const dateMap: Record<CalendarDateType, Dayjs> = {
    'prev-month': prevMonthDay.value,
    'next-month': nextMonthDay.value,
    'prev-year': prevYearDay.value,
    'next-year': nextYearDay.value,
    today: now
  }
  const day = dateMap[type] // 获取目标日期
  pickDay(day)
}

function formatter(text: number, type: CalendarDateCellType): Dayjs {
  switch (type) {
    case 'prev':
      return date.value.startOf('month').subtract(1, 'month').date(text)
    case 'current':
      return date.value.date(text)
    case 'next':
      return date.value.startOf('month').add(1, 'month').date(text)
  }
}
const selectDay = ref<Dayjs>() //当前用户选择哪个日期
function handlePick({ text, type }: CalendarDateCell) {
  // 根据text+type获取日期来更新date
  let day = formatter(text, type)
  selectDay.value = day // 暂存选中的日期
  pickDay(day)
}
function getCellClass({ text, type }): CalendarDateCell {
  const clazz: string[] = [type]
  const date = formatter(text, type)

  //选中的日期 与 当前日期是否相同
  if (date.isSame(selectDay.value, 'day')) {
    clazz.push(calDay.is('selected', true))
  }
  if (date.isSame(now, 'day')) {
    clazz.push(calDay.is('today', true))
  }
  return clazz
}

const currentDate = computed(() => {
  return `${date.value.year()}年${
    date.value.month() + 1
  }月${date.value.date()}日`
})

function getSlotData({ text, type }: CalendarDateCell) {
  let day = formatter(text, type)
  return {
    isSelected: day.isSame(selectDay.value),
    day: day.format('YYYY-MM-DD'),
    date: day.toDate(),
    type
  }
}
</script>
