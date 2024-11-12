import { RangeOptions, VirtualOptions, updateType } from './props'

export function initVirtual(param: VirtualOptions, update: updateType) {
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }
  function getPadFront() {
    return param.estimateSize * range.start
  }

  function getPadBehind() {
    const lastIndex = param.estimateSize - 1
    return (lastIndex - range.end) * param.estimateSize
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

  checkRange(0, param.keeps - 1)

  return {}
}
