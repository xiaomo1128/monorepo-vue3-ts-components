/*
 * @Author: xiaomo1128 493559026@qq.com
 * @Date: 2024-10-23 10:00:47
 * @LastEditors: xiaomo1128 493559026@qq.com
 * @LastEditTime: 2024-10-26 22:05:23
 * @FilePath: \monorepo-demo\packages\components\icon\src\icon.ts
 * @Description: 这里面准备组件相关的属性 和 ts类型
 */

import {ExtractPropTypes, PropType} from 'vue'

export const iconProps = {
    color:String,
    size: [Number, String] as PropType<number | string>
} as const;

export type IconProps = ExtractPropTypes<typeof iconProps>;
