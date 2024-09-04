<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input
        v-model="params.name"
        clearable
        placeholder="请输入内容"
        class="search-main"
        @clear="search"
      />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <!-- 添加企业 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addEnterprise')"
        >添加企业</el-button
      >
    </div>

    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="enterpriseList"
        @expand-change="expandChange"
      >
        <!-- 展开区域 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rentList">
              <el-table-column
                label="租赁楼宇"
                width="320"
                prop="buildingName"
              />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态">
                <template #default="scope">
                  <!--
                    差值表达式支持函数调用吗？支持
                    调用一个函数的时候 差值表达式的位置渲染的是什么？ 函数执行之后的返回值
                   -->
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <!--
                  退租：如果当前是退租的状态 禁用  如果不是退租的状态 启用
                  删除：只有已退租的时候 删除才是启用的 否则就是禁用的
                 -->
                <template #default="scope">
                  <el-button
                    size="mini"
                    :disabled="scope.row.status === 3"
                    type="text"
                    @click="outRent(scope.row.id)"
                    >退租</el-button
                  >
                  <el-button
                    size="mini"
                    :disabled="scope.row.status !== 3"
                    type="text"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-permission="'park:rent:add_surrender'" size="mini" type="text" @click="addRent(scope.row.id)"
              >添加合同</el-button
            >
            <el-button size="mini" type="text" @click="$router.push(`/enterpriseDetail/${scope.row.id}`)">查看</el-button>
            <el-button size="mini" type="text" @click="toEditPage(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="delEnterprise(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="handleChange"
      />
    </div>

    <!-- 添加合同的弹框 -->
    <!-- title ： 控制左上角的文本 -->
    <!-- visible ： 控制弹框的显示与隐藏 -->
    <!-- close事件 ： 弹框关闭时会执行close后的处理函数 -->
    <!-- :close-on-click-modal ：控制点击模态框（遮罩）时，是否关闭弹框 -->
    <el-dialog
      title="添加合同"
      :visible="rentDialogVisible"
      width="580px"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form
          ref="addForm"
          :model="rentForm"
          :rules="rentRules"
          label-position="top"
        >
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <!-- http-request ： 覆盖默认上传（action） -->
            <!-- :before-upload : 上传前的钩子-->
            <!-- on-remove : 文件移除时会自动执行 -->
            <el-upload
              ref="upload"
              action="#"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="onExceed"
              :on-remove="onRemove"
            >
              <el-button size="small" type="primary" plain
                >上传合同文件</el-button
              >
              <div slot="tip" class="el-upload__tip">
                支持扩展名：.doc .docx .pdf, 文件大小不超过5M
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEnterpriseListAPI,
  deleteEnterpriseAPI,
  getRentBuildingAPI,
  addRentAPI,
  getExpandEnterpriseRentAPI,
  outRentAPI,
} from "@/api/enterprise";
import { uploadFileAPI } from "@/api/common";

export default {
  name: "enterprise",
  data() {
    return {
      params: {
        name: "", // 收集输入的企业名字，然后可以根据企业名称进行模糊搜索
        page: 1,
        pageSize: 2, //每页的页容量
      },

      enterpriseList: [],
      total: 0, //总个数，默认为0
      rentDialogVisible: false, //控制弹框的显示&隐藏

      // 合同部分
      // 租赁表单数据
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: "", // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [], // 合同时间
      },
      // 租赁规则限制
      rentRules: {
        buildingId: [
          { required: true, message: "请选择楼宇", trigger: "change" },
        ],
        rentTime: [
          { required: true, message: "请选择租赁日期", trigger: "change" },
        ],
        contractId: [
          { required: true, message: "请上传合同文件", trigger: "change" },
        ],
      },
      // 可租赁楼宇列表
      rentBuildingList: [],
    };
  },

  mounted() {
    this.getEnterpriseList();
  },

  methods: {
    //获取列表
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params);
      this.enterpriseList = res.data.rows.map((item) => {
        return {
          ...item,
          rentList: [], // 合同列表
        };
      });
      this.total = res.data.total;
    },
    //点击查询按钮
    search() {
      //重置page为1
      this.params.page = 1;
      this.getEnterpriseList();
    },

    //el-pagnation部分
    //计算每一条记录的序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1;
    },
    //切换页码的时候，获取到的当前点击的是哪个页码
    handleChange(val) {
      this.params.page = val;
      this.getEnterpriseList();
    },

    //编辑企业
    toEditPage(id) {
      this.$router.push({
        path: "/addEnterprise",
        query: {
          id,
        },
      });
    },

    //删除企业
    delEnterprise(id) {
      this.$confirm("您确定要删除该企业吗？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await deleteEnterpriseAPI(id);
        this.getEnterpriseList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    //关闭弹框 时 的处理函数
    closeDialog() {
      this.rentDialogVisible = false;
      //   // 关闭弹框时清空所有内容
      this.$refs.addForm.resetFields(); //这一行只能清空绑定了prop属性的表单域

      //   清空表单至原始状态(防止比如：填完后不提交，按了取消，又重新打开时数据回显的情况)
      this.rentForm = {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: "", // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [], // 合同时间
      };
      this.$refs.upload.clearFiles();
      this.$refs.addForm.validateField("contractId");
    },

    async addRent(id) {
      this.rentDialogVisible = true;
      this.rentForm.enterpriseId = id;
      const res = await getRentBuildingAPI();
      this.rentBuildingList = res.data;
    },

    async httpRequest({ file }) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", 2);
      const res = await uploadFileAPI(formData);
      console.log(res);
      this.rentForm.contractId = res.data.id;
      this.rentForm.contractUrl = res.data.url;
      // 清除多余的提示
      this.$refs.addForm.validateField("contractId");
    },

    beforeUpload(file) {
      const fileType = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/pdf",
      ];
      const result = fileType.includes(file.type);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (result && isLt5M) {
        return true;
      } else {
        this.$message.warning("上传文件错误，请重新选择文件");
        return false;
      }
    },
    onExceed() {
      this.$message.warning("请注意，文件一超出最大限制 1 !");
    },
    //添加合同弹框里的确认键
    confirmAdd() {
      this.$refs.addForm.validate((flag) => {
        if (!flag) return;
        const { buildingId, contractId, contractUrl, type, enterpriseId } =
          this.rentForm;
        const reqData = {
          buildingId,
          contractId,
          contractUrl,
          type,
          enterpriseId,
          startTime: this.rentForm.rentTime[0],
          endTime: this.rentForm.rentTime[1],
        };
        addRentAPI(reqData);
        this.$message.success("添加合同成功");
        // 添加成功后刷新一下列表，因为添加后页面可能会改变
        this.getEnterpriseList();
        // 关闭弹框 + 清空数据
        this.closeDialog();
      });
    },
    // 删除附件后
    onRemove() {
      this.rentForm.contractId = "";
      this.rentForm.contractUrl = "";
      this.$refs.addForm.validateField("contractId");
    },

    //   点击展开或者关闭都会触发该事件
    // row ： 当前展开/关闭那一行的数据
    // expandedRows ： 所有展开的数据都在里面（数组形式）
    async expandChange(row, expandedRows) {
      //判断当前行的状态是展开的还是关闭的
      const isInclude = expandedRows.find((item) => item.id === row.id);
      if (!isInclude) return;
      const res = await getExpandEnterpriseRentAPI(row.id);
      //   console.log(res)
      row.rentList = res.data;
    },
    formatInfoType(status) {
      const MAP = {
        0: "warning",
        1: "success",
        2: "info",
        3: "danger",
      };
      // return 格式化之后的中文显示
      return MAP[status];
    },
    formatStatus(status) {
      //   console.log(status);
      const MAP = {
        0: "待生效",
        1: "生效中",
        2: "已到期",
        3: "已退租",
      };
      // return 格式化之后的中文显示
      return MAP[status];
    },
  },

  // 删除合同
  delRent(id) {
    this.$confirm("确认删除此合同吗吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        // 1. 调用接口
        await delRentAPI(id);
        // 2. 重新拉取列表
        this.getEnterpriseList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消删除",
        });
      });
    },
    outRent(id) {
        this.$confirm('您确定要退租吗？', '温馨提示').then(async () => {
            await outRentAPI(id)
            this.$message.success('退租成功')
        }).catch(()=>{})
  }
};
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
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
</style>
