<template>
    <div :class="[bem.b(), bem.is('selected', isSelected), bem.is('disabled', node.disabled)]">
        <div :class="[bem.e('content')]" :style="{ paddingLeft: `${node?.level as number * 16}px` }">
            <span
                :class="[bem.e('expand-icon'), { expanded: expanded && !node?.isLeaf }, bem.is('leaf', node?.isLeaf as boolean)]"
                @click="handleExpand">
                <ZIcon size="16" color="pink">
                    <Switcher v-if="!isLoading"></Switcher>
                    <Loading v-else></Loading>
                </ZIcon>
            </span>

            <!-- 多选框 -->
            <z-checkbox v-if="showCheckbox" :disabled="disabled" :model-value="checked" :indeterminate="indeterminate"
                @change="handleCheckChange"></z-checkbox>

            <span @click="handleSelected" :class="bem.e('label')">
                <ZTreeNodeContent :node="node"></ZTreeNodeContent>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create';
import { TreeNode, treeNodeEmits, treeNodeProps } from './tree';
import Switcher from './icon/Switcher';
import Loading from './icon/Loading';
import ZIcon from '@zi-shui/components/icon';
import { computed } from 'vue';
import ZTreeNodeContent from './tree-node-content';
import ZCheckbox from '@zi-shui/components/checkbox';

const bem = createNamespace('tree-node')

const props = defineProps(treeNodeProps)
const emit = defineEmits(treeNodeEmits)

function handleExpand() {
    emit('toggle', props.node as TreeNode)
}

const isLoading = computed(() => {
    return props.loadingKeys?.has(props.node!.key)
})

const isSelected = computed(() => {
    return props.selectedKeys?.includes(props.node!.key)
})

function handleSelected() {
    if (props.node?.disabled) return
    emit('select', props.node as TreeNode)
}

function handleCheckChange(val: boolean) {
    emit('check', props.node as TreeNode, val)
}
</script>
