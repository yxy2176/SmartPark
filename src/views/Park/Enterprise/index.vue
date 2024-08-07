<template>
<<<<<<< HEAD
    <div class="building-container">
        <!-- 搜索区域 -->
        <div class="search-container">
            <div class="search-label">企业名称：</div>
            <el-input clearable placeholder="请输入内容" class="search-main" @clear="search" />
            <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="create-container">
            <el-button type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
        </div>
        <!-- 表格区域 -->
        <div class="table">
            <el-table style="width: 100%" :data="enterpriseList">
                <el-table-column type="index" label="序号" :index="indexMethod" />
                <el-table-column label="企业名称" width="320" prop="name" />
                <el-table-column label="联系人" prop="contact" />
                <el-table-column label="联系电话" prop="contactNumber" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="mini" type="text">添加合同</el-button>
                        <el-button size="mini" type="text">查看</el-button>
                        <el-button size="mini" type="text" @click="toEditPage(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="text" @click="delEnterprise(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-container">
            <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="handleChange" />
        </div>
    </div>
</template>

<script>
import { getEnterpriseListAPI, delExterpriseAPI } from '@/api/enterprise';

export default {
    name:'enterprise',
    data() {
        return {
            enterpriseList: [],
            params: {
                page:1,
                pageSize:10
            },
            enterpriseList: [],
            total:0
        }
    },
    mounted() {
        this.getEnterpriseList()
    },

    methods: {
        //删除企业
        delEnterprise(id) {
            this.$confirm('您确定要删除该企业吗？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await delExterpriseAPI(id)
                this.getExterpriseList()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                }).catch(()=>{})
            })
        },
        //编辑企业
        toEditPage(id) {
            this.$router.push({
                path: 'addEnterprise',
                query: {
                    id
                }
            })
        },
        //点击查询按钮
        search() {
            //重置page为1
            this.params.page = 1
            this.getEnterpriseList()
        },
        //计算序号
        indexMethod(index) {
            return(this.params.page - 1) * this.params.pageSize + index + 1
        },
        //获取列表
        async getEnterpriseList() {
            const res = await getEnterpriseListAPI(this.params)
            this.enterpriseList = res.data.rows
        },
        //点击分页
        handleChange(val) {
            this.params.page=val
            this.getEnterpriseList
        }

    },
=======
  <div class="enterprise-container">
    企业管理
  </div>
</template>

<script>
export default {
  name: 'Building'
>>>>>>> 148bddaa5a56f45809d8e1092c7a55c3db4d6434
}
</script>

<style lang="scss" scoped>
<<<<<<< HEAD
.department-container {
    padding: 10px;
}

.search-container {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(237, 237, 237, .9);
    ;
    padding-bottom: 20px;

    .search-label {
        width: 100px;
    }

    .search-main {
        width: 220px;
        margin-right: 10px;
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
=======
>>>>>>> 148bddaa5a56f45809d8e1092c7a55c3db4d6434
</style>
