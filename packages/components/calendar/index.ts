import { withInstall } from '@zi-shui/utils/with-install'
import _Calendar from './src/calendar.vue'

const Calendar = withInstall(_Calendar)

declare module 'vue' {
  export interface GlobalComponents {
    ZCalendar: typeof Calendar
  }
}

export * from './src/calendar'
export default Calendar
