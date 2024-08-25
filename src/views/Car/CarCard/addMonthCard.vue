<template>
    <div class="add-card">
        <header class="add-header">
            <el-page-header :content='id?"编辑月卡":"增加月卡"' @back="$router.back()" />
        </header>
        <main class="add-main">
            <div class="form-container">
                <div class="title">车辆信息</div>
                <div class="form">
                    <!-- el-form :model =>绑定表单的数据对象  /  :rules => 绑定表单的验证规则 -->
                    <!-- el-form-item prop =>指定当前表单项绑定的数据字段，并与验证规则关联-->
                    <!-- 表单元素 v-model =>实现双向数据绑定 -->
                    <el-form ref="carInfoForm" label-width="100px" :model="carInfoForm" :rules="carInfoRules">
                        <el-form-item label="车主姓名" prop="personName">
                            <el-input v-model="carInfoForm.personName" />
                        </el-form-item>
                        <el-form-item label="联系方式" prop="phoneNumber">
                            <el-input v-model="carInfoForm.phoneNumber" />
                        </el-form-item>
                        <el-form-item label="车辆号码" prop="carNumber">
                            <el-input v-model="carInfoForm.carNumber" />
                        </el-form-item>
                        <el-form-item label="车辆品牌" prop="carBrand">
                            <el-input v-model="carInfoForm.carBrand" />
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="form-container">
                <div class="title">最新一次月卡缴费信息</div>
                <div class="form">
                    <el-form ref="feeInfoForm" label-width="100px" :model="feeInfoForm" :rules="feeFormRules">
                        <el-form-item label="有效日期" prop="payTime">
                            <!--
                            日期格式中：
                              1、使用 format ： 指定输入框的格式
                              2、使用 value-format : 指定绑定值的格式
                             -->
                            <el-date-picker v-model="feeInfoForm.payTime" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" />
                        </el-form-item>
                        <el-form-item label="支付金额" prop="paymentAmount">
                            <el-input v-model="feeInfoForm.paymentAmount" />
                        </el-form-item>
                        <el-form-item label="支付方式" prop="paymentMethod">
                            <el-select v-model="feeInfoForm.paymentMethod">
                                <el-option v-for="item in payMethodList" :key="item.value" :value="item.value"
                                    :label="item.text" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </main>
        <footer class="add-footer">
            <div class="btn-container">
                <el-button @click="resetForm">重置</el-button>
                <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
        </footer>
    </div>
</template>

<script>
import {addCardAPI, getCardDetailAPI,editCardAPI } from '@/api/card.js'
export default {
    name: 'addMonnthCard',
    data() {
        return {
            // 车辆信息
            carInfoForm: {
                personName: '',
                phoneNumber: '',
                carNumber: '',
                carBrand: '',
            },

            // 车辆验证规则
            carInfoRules: {
                personName: [
                    { required: true, message: '车主姓名不可为空', trigger: 'blur' }
                ],
                phoneNumber: [
                    { required: true, message: '联系方式不可为空', trigger: 'blur' },
                    //正则校验
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
                ],
                carNumber: [
                    { required: true, message: '车辆号码不可为空', trigger: 'blur' },
                    //自定义校验 validator校验方法，不需要配置Message
                    { validator: this.validatorCarNumber, trigger: 'blur' }
                ],
                carBrand: [
                    { required: true, message: '车辆品牌不可为空', trigger: 'blur' }
                ],
            },

            // 支付方式列表
            payMethodList: [
                { text: '支付宝', value: 'Alipay' },
                { text: '微信', value: 'WeChat' },
                { text: '线下', value: 'Cash' }
            ],

            feeInfoForm: {
                payTime: [],
                paymentAmount: '',
                paymentMethod: ''
            },

            feeFormRules: {
                payTime: [
                    { required: true, message: '有效日期不可为空', trigger: 'blur' }
                ],
                cardEndDate: [
                    { required: true, message: '有效日期不可为空', trigger: 'blur' }
                ],
                cardStartDate: [
                    { required: true, message: '有效日期不可为空', trigger: 'change' }
                ],
            }
        }

    },

    computed: {
        id() {
            return this.$route.query.id
        }
    },
    //写在mounted里也行
    created() {
        //有 id(编辑)时 ： 回显数据
        if (this.id)
            this.getCardDetail()
    },

    methods: {
        async getCardDetail() {
            // 或者const {data} = ...   =>这样的话下面就不用res.data了，只需要data
            const res = await getCardDetailAPI(this.id)
            // 1. 回填车辆信息的表单
            const { personName, phoneNumber, carNumber, carBrand, carInfoId } = res.data
            this.carInfoForm = {
                personName, phoneNumber, carNumber, carBrand, carInfoId
            }
            // 2. 回填缴费信息表单
            const { cardStartDate, cardEndDate, paymentAmount, paymentMethod, rechargeId } = res.data
            this.feeInfoForm = {
                payTime: [cardStartDate, cardEndDate],
                paymentAmount,
                paymentMethod,
                rechargeId,
            }
        },

        //点击确定按钮
        confirmAdd() {
            this.$refs.carInfoForm.validate(valid => {
                if (valid) {
                    this.$refs.feeInfoForm.validate(async (valid) => {
                        //全部校验通过
                        if (valid) {
                            //参数处理
                            const requestData = {
                                ...this.feeInfoForm,
                                ...this.carInfoForm,
                                //单独处理时间
                                cardStartDate: this.feeInfoForm.payTime[0],
                                cardEndDate: this.feeInfoForm.payTime[1]
                            }
                            //因为接口做了校验，多字段不行，所以提交之前把多余的字段payTime删除
                            delete requestData.payTime
                            // console.log(requestData)

                            if (this.id) {
                                await editCardAPI(requestData)
                                this.$message.success('月卡编辑成功')
                            } else {
                                await addCardAPI(requestData)
                                //提交以后跳回去
                                this.$message.success('月卡添加成功')
                            }
                            // 后续处理
                            // 提示用户
                            this.$message.success(`${this.id ? '更新成功' : '新增成功'}`)
                            // 跳回列表
                            this.$router.back()

                        }
                    })
                }
            })
        },

        //重置表单
        resetForm() {
            // resetFields()的限制：只能清空加了prop表单域的内容
            this.$refs.cardInfoForm.resetFields()
            this.$refs.feeInfoForm.resetFields()
        },

        //三个参数 ： rule value callback
        //rule用不着
        //value:用户输入的数据
        //callback:不管校验成功还是失败都要调用
        //（1）成功时：callback()
        //（2）失败时：callback(new Error(错误信息))
        validatorCarNumber(rule, value, callback) {
            const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
            if (plateNumberRegex.test(value)) {
                callback()
            } else {
                callback(new Error('车牌号格式不正确'))
            }
        }
    }
}
</script>

<style scoped lang="scss">
.add-card {
    background-color: #f4f6f8;
    height: 100vh;

    .add-header {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 64px;
        background-color: #fff;

        .left {
            span {
                margin-right: 4px;
            }

            .arrow {
                cursor: pointer;
            }
        }

        .right {
            text-align: right;
        }
    }

    .add-main {
        background: #f4f6f8;
        padding: 20px 130px;

        .form-container {
            background-color: #fff;

            .title {
                height: 60px;
                line-height: 60px;
                padding-left: 20px;
            }

            .form {
                margin-bottom: 20px;
                padding: 20px 65px 24px;

                .el-form {
                    display: flex;
                    flex-wrap: wrap;

                    .el-form-item {
                        width: 50%;
                    }
                }
            }
        }

        .preview {
            img {
                width: 100px;
            }
        }
    }

    .add-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 24px 50px;
        color: #000000d9;
        font-size: 14px;
        background: #fff;
        text-align: center;
    }
}
</style>
