<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="addFeeRule">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 增加停车计费规则的弹框 -->
    <AddRule ref="addRule" :dialog-visible.sync="dialogVisible" />
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式" prop="chargeType">
          <template #default="scope">
            {{ formatChargeType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editRule(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="delRule(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; float: right">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="params.pageSize"
          @current-change="currentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { deleteRuleAPI, getRuleListAPI } from "@/api/car";
import { utils, writeFileXLSX } from "xlsx";
import AddRule from "@/views/Car/components/AddRule.vue";
export default {
  name: "Building",
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 2,
      },
      total: 0,
      dialogVisible: false,
    };
  },
  components: {
    AddRule,
  },
  created() {
    this.getRuleList();
  },
  methods: {
    // 获取当前计费规则的列表
    async getRuleList() {
      const res = await getRuleListAPI(this.params);
      this.ruleList = res.data.rows;
      this.total = res.data.total;
    },
    //   currentChange 的参数为 当前切换后的页码
    currentChange(val) {
      this.params.page = val;
      this.getRuleList();
    },
    // 参数为行号
    indexMethod(row) {
      return (this.params.page - 1) * this.params.pageSize + row + 1;
    },
    // 导出至Excel
    async exportToExcel() {
      const res = await getRuleListAPI(this.params);
      // 表头英文字段key
      const tableHeaderKeys = [
        "ruleNumber",
        "ruleName",
        "freeDuration",
        "chargeCeiling",
        "chargeType",
        "ruleNameView",
      ];
      // 表头中文字段value
      const tableHeaderValues = [
        "计费规则编号",
        "计费规则名称",
        "免费时长(分钟)",
        "收费上线(元)",
        "计费方式",
        "计费规则",
      ];
      const sheetData = res.data.rows.map((item) => {
        const obj = {};
        tableHeaderKeys.forEach((key) => {
          obj[key] = item[key];
        });
        return obj;
      });
      // 创建一个新的工作簿
      const workbook = utils.book_new();
      //   创建一个工作表 ->要求是一个对象数组形式
      const worksheet = utils.json_to_sheet(sheetData);
      // 把工作表添加到工作簿中，Data为工作表的名称
      utils.book_append_sheet(workbook, worksheet, "Data");
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: "A1" });
      // 使用导出方法进行导出
      writeFileXLSX(workbook, "SheetJSVue.xlsx");
    },
    // 适配收费状态
    formatChargeType(type) {
      const TYPEMAP = {
        duration: "按时长收费",
        turn: "按次收费",
        partition: "分段收费",
      };
      return TYPEMAP[type];
    },
    //   添加计费规则
    addFeeRule() {
      this.dialogVisible = true;
      this.$refs.addRule.title = "添加规则";
    },
    //   closeDialog() {
    //     this.dialogVisible = false;
    // }
    // 删除
    delRule(id) {
      this.$confirm("您确定要删除该规则吗？", "温馨提示").then(async () => {
        await deleteRuleAPI(id);
        this.$message.success("删除成功");
        if (this.ruleList.length === 1 && this.params.page > 1) {
          this.params.page--;
        }
        this.getRuleList();
      });
    },
    // 编辑
    editRule(id) {
      this.dialogVisible = true;
      this.$refs.addRule.getParkingRule(id);
      this.$refs.addRule.title = "修改规则";
    },

  },
};
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
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
</style>
