<!--
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-22 23:54:30
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-27 20:15:08
 * @FilePath: \monorepo-demo\play\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { AddCircle } from '@vicons/ionicons5'
import { FormInstance } from '@zi-shui/components/form'
import { Key, TreeOption } from '@zi-shui/components/tree'
import { UploadRawFile } from '@zi-shui/components/upload'
import { reactive, ref } from 'vue'
// import Icon from '@zi-shui/components/icon/src/icon.vue'

// console.log(Icon);
function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(20 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      label: createLabel(level), // 显示的内容
      key, // 为了唯一性
      children: createData(level - 1, key) // 孩子
    }
  })
}

// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       key: 1,
//       isLeaf: false, // 动态加载子节点
//     }, {
//       label: nextLabel(),
//       key: 2,
//       isLeaf: false,
//     }
//   ]
// }

function nextLabel(currentLabel?: string | undefined | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

const data = ref(createData())

// const data = ref<TreeOption[]>([
//   {
//     key: '0',
//     label: '0',
//     children: [
//       {
//         key: '0-0',
//         label: '0-0'
//       },
//       {
//         disabled: true,
//         key: '0-1',
//         label: '0-1',
//         children: [
//           {
//             label: '0-1-0',
//             key: '0-1-0'
//           },
//           {
//             label: '0-1-1',
//             key: '0-1-1'
//           }
//         ]
//       }
//     ]
//   }
// ])

function handleLoad(node: TreeOption) {
  // 异步加载子节点
  return new Promise<TreeOption[]>(resolve => {
    setTimeout(() => {
      resolve([
        // 当前展开node的children属性
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false // 动态加载子节点
        }
      ])
    }, 1000)
  })
}

const value = ref<Key[]>([])

const check = ref(true)

const handleChange = (val: boolean) => {
  console.log(val)
}

const handleClick = () => {
  console.log('button click')
}

const username = ref('hello')

const handleBlur = (e: FocusEvent) => {
  console.log('blur', (e.target as HTMLInputElement).value)
}

const handleFocus = (e: FocusEvent) => {
  console.log('focus', (e.target as HTMLInputElement).value)
}

const state = reactive({
  username: 'xiaomo1128',
  passward: '123456'
})

const formRef = ref<FormInstance>()

const validateForm = () => {
  const form = formRef.value
  form?.validate().then((valid, errors) => {
    console.log(valid, errors)
  })
}

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  // return false
  return true
}
</script>

<template>
  <div>
    <z-icon :color="'red'" :size="20">
      <AddCircle></AddCircle>
    </z-icon>

    <z-icon :color="'blue'" :size="20">
      <AddCircle></AddCircle>
    </z-icon>

    <!-- 传递一个树形结构 
      selectable 节点是否可选
      multiple 节点是否可多选
      selected-keys 选中的节点的key值
    -->
    {{ value }}
    <z-tree
      :data="data"
      :on-load="handleLoad"
      v-model:selected-keys="value"
      selectable
      :show-checkbox="true"
      :default-checked-keys="['40', '41']"
    >
      <template #default="{ node }">
        {{ node.key }} - {{ node.label }}
      </template>
    </z-tree>
    <!-- <z-tree :data="data" label-field="label" key-field="key" children-field="children"></z-tree> -->
    <hr />

    {{ check }}
    <z-checkbox
      v-model="check"
      :disabled="false"
      :indeterminate="true"
      :label="'节点'"
      @change="handleChange"
    >
      节点2
    </z-checkbox>
    <hr />
    <z-button
      @click="handleClick"
      @mousedown="handleClick"
      size="large"
      type="danger"
      :round="true"
      :loading="false"
      icon-placement="left"
    >
      按钮
      <template #icon>
        <z-icon>
          <AddCircle></AddCircle>
        </z-icon>
      </template>
    </z-button>
    <hr />
    {{ username }}
    <z-input
      v-model="username"
      @blur="handleBlur"
      @focus="handleFocus"
      :placeholder="'请输入用户名'"
      :show-password="true"
      :clearable="true"
    >
      <template #prepend>aaa</template>
      <template #prefixIcon>
        <!-- bbb -->
        <z-icon>
          <AddCircle></AddCircle>
        </z-icon>
      </template>

      <template #suffixIcon>
        <!-- <z-icon>
          <AddCircle></AddCircle>
        </z-icon> -->
      </template>

      <template #append>ddd</template>
    </z-input>

    <hr />
    <z-form
      ref="formRef"
      :model="state"
      :rules="{
        username: {
          min: 6,
          max: 10,
          message: '用户名6-10位',
          trigger: ['change', 'blur']
        }
      }"
    >
      <z-form-item
        prop="username"
        label="用户名"
        :rules="[
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ]"
      >
        <z-input
          placeholder="请输入用户名"
          :clearable="true"
          v-model="state.username"
        ></z-input>

        <template #label>用户名</template>
      </z-form-item>

      <z-form-item
        prop="passward"
        label="密码"
        :rules="[
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]"
      >
        <z-input
          placeholder="请输入密码"
          :show-password="true"
          :clearable="true"
          v-model="state.passward"
        ></z-input>

        <template #label>用户名</template>
      </z-form-item>
      <z-button @click="validateForm"> 按钮</z-button>
    </z-form>
    <hr />
    <z-upload
      multiple
      :before-upload="handleBeforeUpload"
      action="http://localhost:4000/upload"
      drag
    >
      <z-button>上传文件</z-button>
    </z-upload>

    <hr />
    <z-calendar></z-calendar>
  </div>
</template>
