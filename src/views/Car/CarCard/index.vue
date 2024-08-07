<template>
    <div class="card-container">
        <!-- 搜索区域 -->
        <div class="search-container">
            <span class="search-label">车牌号码：</span>
            <!-- clearable属性的作用是为输入框添加一个清除按钮 -->
            <el-input clearable placeholder="请输入内容" class="search-main" />
            <span class="search-label">车主姓名：</span>
            <el-input clearable placeholder="请输入内容" class="search-main" />
            <span class="search-label">状态：</span>
            <el-select v-model="params.cardStatus">
                <el-option v-for="item in []" :key="item.id" />
            </el-select>
            <el-button type="primary" class="search-btn">查询</el-button>
        </div>
        <!-- 新增删除操作区域 -->
        <div class="create-container">
            <el-button type="primary">添加月卡</el-button>
            <el-button>批量删除</el-button>
        </div>
        <!-- 表格区域 -->
        <div class="table">
            <el-table style="width: 100%" :data="list" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" />
                <el-table-column label="车主名称" />
                <el-table-column label="联系方式" />
                <el-table-column label="车牌号码" />
                <el-table-column label="车辆品牌" />
                <el-table-column label="剩余有效天数" />
                <el-table-column label="操作" fixed="right" width="180">
                    <!-- #default="scope" 等价于 v-slot:default="scope" -->
                    <!-- scope是插槽的作用域对象，包含当前行的数据和属性 -->
                    <!-- scope.row指的是表格当前行的数据对象。scope可以取任何喜欢的名字，常见的有scope、slotProps、props等。 -->
                    <!-- 常见属性：row、column、$index、store -->
                    <!-- scope.$index 获取当前行的索引。 -->
                    <!-- store:表格的内部状态管理对象 -> 用于访问和操作表格的内部状态，如选中行、排序状态等（一般不常用）-->
                    <template #default="scope">
                        <el-button size="mini" type="text">续费</el-button>
                        <el-button size="mini" type="text">查看</el-button>
                        <el-button size="mini" type="text" @click="editCard(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-container">
            <el-pagination layout="total, prev, pager, next" :total="0" />
        </div>
        <!-- 添加楼宇 -->
        <el-dialog title="添加楼宇" width="580px">
            <!-- 表单接口 -->
            <div class="form-container">
                <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
            </div>
            <template #footer>
                <el-button size="mini">取 消</el-button>
                <el-button size="mini" type="primary">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>


<script>
import { deleteCardAPI } from '@/api/card';

export default {
    name: 'card',
    data() {
        return {
            params: {
                page: 1,
                pageSize: 2,
                carNumber: '',
                personName: '',
                cardStatus: null
            },
            list: [],
            total: 0,
            statusList: [
                {
                    text: '全部',
                    value: null
                },
                {
                    text: '可用',
                    value: '0'
                },
                {
                    text: '已过期',
                    value: '1'
                }
            ],
            selectionVal: [],

        }
    },

    methods: {

        //编辑卡片 -> 接收一个参数id
        editCard(id) {
            this.$router.push({
                path: '/car/addMonthCard',
                query: {
                    id
                }
            })
        },
        //删除月卡
        deleteCard(id) {
            this.$confirm('您确定要删除此数据吗？', '温馨提示', {
                //这两个不写其实也行，默认项就是确定/取消
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await deleteCardAPI(id)
                this.getCardList()
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                })
            }).catch((error) => {
                console.log(error)
            })
        },

        // 点击批量删除
        batchDeleteCard() {
            if (this.selectionVal.length <= 0) {
                this.$message.warning('请先选择您要删除的数据!')
                return
            }
            const ids = this.selectionVal.map(item => {
                return item.id
            })
            this.$confirm('您确定要删除这些数据吗？', '温馨提示').then(async () => {
                // 接口中有提到多个id批量删除时，用join连接
                await deleteCardAPI(ids.join(','))
                this.$message.success('批量删除成功!')
                this.getCardList()
            }).catch(()=>{})
        },

        // 用户选择的数据
        handleSelectionChange(val) {
            this.selectionVal = val
        },
        // 获取月卡列表
        async getCardList() {
            const res = await getCardListAPI(this.params)
            this.list = res.data.rows
            this.total = res.data.total
        },
        handleSizeChange(val) {
            this.params.pageSize = val
            this.getCardList()
        },
        handleCurrentChange(val) {
            this.params.page = val
            this.getCardList()
        },
    }


}
</script>


<style lang="scss" scoped>
.card-container {
    padding: 20px;
    background-color: #fff;
}


.search-container {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(237, 237, 237, .9);
    padding-bottom: 20px;

    .search-main {
        width: 220px;
        margin-right: 10px;
    }

    .search-btn {
        margin-left: 20px;
    }
}

.create-container {
    margin: 10px 0px;
}

.page-container {
    padding: 4px 0px;
    text-align: right;
}

.form-container {
    padding: 0px 80px;
}
</style>
