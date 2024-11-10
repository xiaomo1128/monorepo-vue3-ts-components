<template>
  <div :class="cal.b()">
    <div :class="cal.e('header')">
      <div :class="cal.e('title')">标题</div>
      <div :class="cal.e('button-group')">
        <z-button>前一年</z-button>
        <z-button>上个月</z-button>
        <z-button>今天</z-button>
        <z-button>下个月</z-button>
        <z-button>下一年</z-button>
      </div>
    </div>

    <div :class="cal.e('body')">
      <table :class="calTable.b()">
        <thead>
          <tr>
            <th v-for="day in weekDays">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rid) in rows" :key="rid">
            <td v-for="(cell, cid) in row" :key="cid" :class="calDay.b()">
              {{ cell.text }}
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
import dayjs from 'dayjs'
import { computed } from 'vue'
import { CalendarDateCell, calendarProps } from './calendar'

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
</script>
