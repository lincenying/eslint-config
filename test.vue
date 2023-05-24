<template>
    <div v-loading="loading" class="index-box center-box">
        <div class="back" @click="$router.push('/index-big/index')">&lt; 返回首页</div>
        <div class="top">
            <!-- <div class="top-left">
                <div class="top-left-item">
                    总CPU:<span>{{ echartsData.data1.cpu }}</span>
                </div>
                <div class="top-left-item">
                    总内存:<span>{{ echartsData.data1.memory }}</span>
                </div>
                <div class="top-left-item">
                    总存储:<span>{{ echartsData.data1.storage }}</span>
                </div>
            </div> -->
            <div class="top-right">
                <div class="select-box">
                    <el-select v-model="selectValue1" size="mini" placeholder="请选择" @change="onChange1">
                        <el-option v-for="item in selectData1" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </div>
                <div class="select-box">
                    <el-select v-model="selectValue2" size="mini" placeholder="请选择" @change="onChange2">
                        <el-option v-for="item in selectData2" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </div>
                <!-- <div class="select-box">
                    <el-select v-model="selectValue1" size="mini" placeholder="主机组">
                        <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </div> -->
            </div>
        </div>
        <div class="svg-box">
            <svg viewBox="0 0 1656 910" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <image width="1656" height="910" xlink:href="@/assets/images/cloud/yun.png" />
                <g v-if="!ISDEV">
                    <template v-for="(item, index) in area1Line">
                        <path :key="`a${index}`" fill="transparent" stroke="#145b89" stroke-width="2" :d="item[0]" class="short-path" />
                        <path
                            :key="`b${index}`"
                            fill="transparent"
                            :stroke="item[1] || '#eda720'"
                            stroke-width="2"
                            :d="item[0]"
                            class="short-line2"
                        />
                        <path :key="`c${index}`" fill="transparent" stroke="#145b89" stroke-width="2" :d="item[0]" class="short-line1" />
                    </template>
                </g>
                <g v-if="!ISDEV">
                    <template v-for="(item, index) in area2Line">
                        <path :key="`a${index}`" fill="transparent" stroke="#145b89" stroke-width="2" :d="item" class="long-path" />
                        <path :key="`b${index}`" fill="transparent" stroke="#eda720" stroke-width="2" :d="item" class="long-line2" />
                        <path :key="`c${index}`" fill="transparent" stroke="#145b89" stroke-width="2" :d="item" class="long-line1" />
                    </template>
                </g>
                <image class="heartbeat" width="86" height="37" x="533" y="226" xlink:href="@/assets/images/cloud/1.png" />
                <text class="svg-text-1" x="578" y="32">{{ echartsData.data1.roma || 0 }}</text>
                <image class="heartbeat" width="87" height="39" x="1337" y="309" xlink:href="@/assets/images/cloud/2.png" />
                <text class="svg-text-1" x="1350" y="109">{{ echartsData.data1.rds || 0 }}</text>
                <image class="heartbeat" width="88" height="41" x="167" y="375" xlink:href="@/assets/images/cloud/3.png" />
                <text class="svg-text-1" x="210" y="174">{{ echartsData.data1.ddm || 0 }}</text>
                <image class="heartbeat" width="94" height="44" x="281" y="638" xlink:href="@/assets/images/cloud/4.png" />
                <text class="svg-text-1" x="335" y="410">{{ echartsData.data1.ecs || 0 }}</text>
                <image class="heartbeat" width="95" height="45" x="1392" y="712" xlink:href="@/assets/images/cloud/5.png" />
                <text class="svg-text-1" x="1380" y="488">{{ echartsData.data1.container || 0 }}</text>
                <image class="heartbeat" width="98" height="47" x="645" y="840" xlink:href="@/assets/images/cloud/5.png" />
                <text class="svg-text-1" x="695" y="590">{{ echartsData.data1.eip || 0 }}</text>
                <!-- <path d="M 708 349 C 682 413 800 454 879 454 C 1000 458 1084 416 1085 362 C 1072 387 986 440 880 430 C 827 434 707 400 708 349 Z" /> -->
            </svg>
        </div>
    </div>
</template>

<script>
import { computed, nextTick, onMounted, watch } from '@vue/composition-api'

import useGlobal from '@/mixins/global'

export default {
    name: 'CenterBox',
    mixins: [],
    props: {
        'echarts-key': String,
        'all': Object,
    },
    emits: ['select-change'],
    setup(props, ctxs) {
        const { ctx, options, route, router, store, ref, reactive, useToggle, useLockFn } = useGlobal()

        const [loading, toggleLoading] = useToggle(true)

        const echartsData = reactive({
            data1: {},
        })

        const area1Line = ref([
            ['M 611 310 L 559 287 L 687 232 L 623 202'],
            ['M 611 310 L 559 287 L 336 381 L 271 350'],
            ['M 1194 325 L 1289 281'],
            [
                'M 742 293 C 730 290 711 245 716 234 C 712 215 730 198 742 198 C 739 192 740 160 753 158 C 763 150 789 174 784 171 C 784 171 794 153 809 150 C 816 146 840 156 852 165 C 877 189 882 208 889 239 L 889 249 C 906 264 918 306 915 319 C 914 335 903 356 887 357 C 870 359 854 349 854 348',
                '#fff',
            ],
        ])
        const area2Line = ref([
            'M 466 422 C 466 430 472 433 471 432 C 473 435 717 549 717 549 L 657 577 L 495 501 L 425 532',
            'M 466 422 C 466 430 472 433 471 432 C 473 435 717 549 717 549 L 657 577 L 856 673 L 780 711',
            'M 466 422 C 466 430 472 433 471 432 C 473 435 717 549 717 549 C 717 549 847 610 863 617 C 878 624 900 622 914 615 L 1092 528 L 1281 614',
            'M 466 422 C 466 430 472 433 471 432 C 473 435 717 549 717 549 C 717 549 847 610 863 617 C 878 624 900 622 914 615 L 1092 528 L 1293 431 C 1297 428 1298 428 1300 421',
        ])

        const selectValue1 = ref('')
        const selectValue2 = ref('')
        const selectData1 = ref([])

        const selectData2 = computed(() => {
            if (selectValue1.value || selectValue1.value === 0) {
                const index = selectData1.value.findIndex(item => item.value === selectValue1.value)
                if (index > -1)
                    return selectData1.value[index].children

                return []
            }
            return []
        })

        const getSelectData = async () => {
            const { code, data } = await ctx.$api.get('cloud/middle/level', {})
            if (code === 200) {
                selectData1.value = data.level
                selectValue1.value = data.level[0].value
                selectValue2.value = data.level[0].children[0].value
                ctxs.emit('select-change', selectValue2.value)
            }
            else {
                ctxs.emit('select-change', 0)
            }
        }
        const getData1 = async () => {
            let data1 = {}
            const { code, data } = await ctx.$api.get(`cloud/middle/data/${selectValue2.value}`, {})
            if (code === 200)
                data1 = data.data

            echartsData.data1 = data1
        }

        const onChange2 = (e) => {
            selectValue2.value = e
            ctxs.emit('select-change', selectValue2.value)
            getData1()
        }

        const onChange1 = async (e) => {
            selectValue1.value = e
            await nextTick()
            setTimeout(() => {
                onChange2(selectData2.value[0].value)
            }, 100)
        }

        const init = async () => {
            await Promise.all([getSelectData()])
            await Promise.all([getData1()])
            toggleLoading(false)
        }

        watch(
            () => props.all,
            () => {
                init()
            },
            { deep: true },
        )

        onMounted(() => {
            if (props.all)
                init()
        })

        // 暴露给 template
        return {
            loading,
            echartsData,
            area1Line,
            area2Line,
            selectValue1,
            selectValue2,
            selectData1,
            selectData2,
            onChange1,
            onChange2,
        }
    },
}
</script>
