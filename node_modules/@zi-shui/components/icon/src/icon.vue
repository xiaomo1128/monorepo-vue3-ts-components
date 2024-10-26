<!--
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-23 10:16:29
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-26 22:52:00
 * @FilePath: \monorepo-demo\packages\components\icon\src\icon.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <i :class="bem.b()" :style="style">
        <slot></slot>
    </i>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create'
import { iconProps } from './icon';
import { computed } from 'vue';

defineOptions({
    name: 'z-icon',
})
const bem = createNamespace('icon')

const props = defineProps(iconProps)

const style = computed(()=>{
    if(!props.size && !props.color) return {}
    return {
        ...(props.size? { "font-size": props.size + 'px' } : {}),
        ...(props.color? { color: props.color } : {})
    }
})

</script>

<style scoped>

</style>