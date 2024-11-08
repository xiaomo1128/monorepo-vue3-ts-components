<template>
    <div :class="[bem.b()]">
        <div :class="bem.e('group')">
            <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
                <slot name="prepend"></slot>
            </div>

            <div :class="[bem.e('wrapper')]">
                <span v-if="slots.prefixIcon" :class="bem.e('prefix')">
                    <slot name="prefixIcon"></slot>
                </span>
                <input :type="type" v-bind="attrs" :class="bem.e('inner')" />

                <span v-if="slots.suffixIcon" :class="bem.e('suffix')">
                    <slot name="suffixIcon"></slot>
                </span>
            </div>

            <div v-if="slots.append" :class="bem.be('group', 'append')">
                <slot name="append"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@zi-shui/utils/create';
import { useAttrs, useSlots } from 'vue';
import { inputEmits, inputProps } from './input';

defineOptions({
    name: 'z-input',
    inheritAttrs: false,
})
const bem = createNamespace('input')
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

const attrs = useAttrs()

const slots = useSlots()
</script>
