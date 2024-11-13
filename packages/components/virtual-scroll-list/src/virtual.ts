import { RangeOptions, VirtualOptions, updateType } from './props'

const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC'
}
export function initVirtual(param: VirtualOptions, update: updateType) {
  let offsetValue = 0 // 没有滚动前的偏移量
  let caclType = CALC_TYPE.INIT // 计算类型
  let fixedSizeVal = 0 // 默认
  const sizes = new Map<string | number, number>()
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }

  function isFixed() {
    return caclType === CALC_TYPE.FIXED
  }

  function getEstimateSize() {
    return isFixed() ? fixedSizeVal : param.estimateSize
  }
  function getPadFront() {
    return getEstimateSize() * range.start
  }

  function getPadBehind() {
    const lastIndex = param.estimateSize - 1
    return (lastIndex - range.end) * getEstimateSize()
  }

  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }
  function checkRange(start: number, end: number) {
    const total = param.uniqueIds.length //所有数据
    const keeps = param.keeps //每页显示的条数
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      start = end - keeps + 1
    }
    updateRange(start, end)
  }

  function getScrollOvers() {
    return Math.floor(offsetValue / getEstimateSize())
  }
  function getEndByStart(start: number) {
    const computedEnd = start + param.keeps - 1
    const end = Math.min(computedEnd, param.uniqueIds.length - 1)
    return end
  }

  //   向上滑动要不要更新start
  function handleFront() {
    //划过多少个
    const overs = getScrollOvers()
    if (overs > range.start) {
      // 开始是0，划到了1，start不用变
      return
    }
    // 划过8个 但开始是15 缓存区是10个
    const start = Math.max(overs, param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }

  function handleBehind() {
    const overs = getScrollOvers()
    if (overs < range.start + param.buffer) {
      // 向下加载时，判断是否在缓存区中
      return
    }
    checkRange(overs, getEndByStart(overs))
  }

  function handleScroll(offset: number) {
    const direction = offset < offsetValue ? 'FRONT' : 'BEHIND'
    offsetValue = offset
    if (direction === 'FRONT') {
      handleFront()
    } else if (direction === 'BEHIND') {
      handleBehind()
    }
  }
  // 固定高度、动态高度，尽量不使用estimateSize操作
  function saveSize(id: string | number, size: number) {
    sizes.set(id, size)
    if (caclType === CALC_TYPE.INIT) {
      fixedSizeVal = size
      caclType = CALC_TYPE.FIXED
    } else if (caclType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      caclType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0 //默认采用estimateSize
    }
  }

  checkRange(0, param.keeps - 1)

  return {
    handleScroll,
    saveSize
  }
}
