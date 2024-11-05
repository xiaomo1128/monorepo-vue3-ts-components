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
            <span @click="handleSelected" :class="bem.e('label')">
                <ZTreeNodeContent :node="node"></ZTreeNodeContent>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@zi-shui/utils/create';
import { TreeNode, treeInjectKey, treeNodeEmits, treeNodeProps } from './tree';
import Switcher from './icon/Switcher';
import Loading from './icon/Loading';
import ZIcon from '@zi-shui/components/icon';
import { computed, inject } from 'vue';
import ZTreeNodeContent from './tree-node-content';

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

</script>
