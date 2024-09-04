<template>
  <div>
    <!-- 弹框 -->
    <el-dialog
      :visible="dialogVisible"
      width="680px"
      :title="title"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-position="top"
        >
          <el-form-item label="计费规则编号" prop="ruleNumber">
            <el-input v-model="addForm.ruleNumber" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="ruleName">
            <el-input v-model="addForm.ruleName" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <!-- el-radio-group ： 单选框组 （互斥的） -->
            <!-- @change="groupChange" -->
            <el-radio-group v-model="addForm.chargeType" size="small">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div
            class="flex-container"
            style="display: flex; justify-content: space-between"
          >
            <el-form-item label="免费时长">
              <el-input v-model="addForm.freeDuration" />
            </el-form-item>
            <el-form-item label="收费上限">
              <el-input v-model="addForm.chargeCeiling" />
            </el-form-item>
          </div>
          <el-form-item label="计费规则" required>
            <!-- 按时长收费区域 -->
            <div
              class="duration"
              style="display: flex"
              v-if="addForm.chargeType === 'duration'"
            >
              每
              <el-form-item prop="durationTime" class="w-150">
                <el-input v-model="addForm.durationTime" class="input-box" />
              </el-form-item>
              小时
              <el-form-item prop="durationPrice" class="w-150">
                <el-input v-model="addForm.durationPrice" class="input-box" />
              </el-form-item>
              元
            </div>
            <!-- 按次收费区域 -->
            <div
              class="turn"
              style="display: flex"
              v-if="addForm.chargeType === 'turn'"
            >
              每次
              <el-form-item prop="turnPrice" class="w-150">
                <el-input
                  v-model="addForm.turnPrice"
                  class="input-box"
                  style="width: 150px"
                />
              </el-form-item>

              元
            </div>
            <!-- 按分段收费区域 -->
            <div class="partition" v-if="addForm.chargeType === 'partition'">
              <div class="item" style="display: flex">
                <el-form-item prop="partitionFrameTime" class="w-150">
                  <el-input
                    v-model="addForm.partitionFrameTime"
                    class="input-box"
                    style="width: 100px"
                  />
                </el-form-item>
                小时内,每小时收费
                <el-form-item prop="partitionFramePrice" class="w-150">
                  <el-input
                    v-model="addForm.partitionFramePrice"
                    class="input-box"
                    style="width: 100px"
                  />
                </el-form-item>
                元
              </div>
              <div class="item" style="display: flex; margin: 30px auto 0">
                每增加
                <el-form-item prop="partitionIncreaseTime">
                  <el-input
                    v-model="addForm.partitionIncreaseTime"
                    class="input-box"
                    style="width: 120px"
                  />
                </el-form-item>
                小时,增加
                <el-form-item prop="partitionIncreasePrice">
                  <el-input
                    v-model="addForm.partitionIncreasePrice"
                    class="input-box"
                    style="width: 120px"
                  />
                </el-form-item>
                元
              </div>
            </div>
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
import { addFeeRuleAPI ,editParkingRuleAPI,getParkingRuleAPI } from "@/api/car";
export default {
  name: "addRule",
  data() {
    return {
      addForm: {
        ruleNumber: "", // 计费规则编号
        ruleName: "", // 计费规则名称
        chargeType: "duration", // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: "hour",
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null, // 超出费为收费价钱
      }, // 计费规则表单对象
      addFormRules: {
        ruleNumber: [
          { required: true, message: "请输入规则编号", trigger: "blur" },
        ],
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        chargeType: [
          { required: true, message: "请选择收费类型", trigger: "blur" },
        ],
        durationTime: [
          { required: true, message: "请输入时间", trigger: "blur" },
        ],
        durationPrice: [
          { required: true, message: "请输入金额", trigger: "blur" },
        ],
        turnPrice: [{ required: true, message: "请输入次数", trigger: "blur" }],
        partitionFrameTime: [
          { required: true, message: "请输入段内时间", trigger: "blur" },
        ],
        partitionFramePrice: [
          { required: true, message: "请输入段内费用", trigger: "blur" },
        ],
        partitionIncreaseTime: [
          { required: true, message: "请输入超出时间", trigger: "blur" },
        ],
        partitionIncreasePrice: [
          { required: true, message: "请输入超出金额", trigger: "blur" },
        ],
      },
      //   feeRuleProp: "", //一打开是默认第一个时长收费，就在durationTime和durationPrice二选一选一个就行
      title: "添加规则",
    };
  },
  //控制弹层的隐藏和显示
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    "addForm.chargeType"(val) {
      // 文本框一旦发生切换，就清空所有校验
      this.$refs.addForm.clearValidate([
        "turnPrice",
        "durationTime",
        "durationPrice",
        "partitionFrameTime",
        "partitionFramePrice",
        "partitionIncreaseTime",
        "partitionIncreasePrice",
      ]);
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:dialogVisible", false);
      this.$refs.addForm.resetFields();
      this.addForm.freeDuration = "";
      this.addForm.chargeCeiling = "";
    },
    // groupChange() {
    //   //   console.log(val);     //输出label的值
    //   this.$refs.addForm.clearValidate([
    //     "turnPrice",
    //     "durationTime",
    //     "durationPrice",
    //     "partitionFrameTime",
    //     "partitionFramePrice",
    //     "partitionIncreaseTime",
    //     "partitionIncreasePrice",
    //   ]);
    // },
    confirmAdd() {
      this.$refs.addForm.validate(async (flag) => {
        if (!flag) return;
        if (this.addForm.id) {
          await editParkingRuleAPI(this.addForm);
          this.$message.success("编辑成功");
        } else {
          await addFeeRuleAPI(this.addForm);
          this.$message.success("添加成功");
        }
        this.closeDialog();
        //   或者使用this.$emit('getList')
        // 然后再在父组件使用子组件时候 ： <AddRule @getList='xxx' />   xxx为子组件想要使用的父里的函数
        this.$parent.getRuleList();
      });
      },
    async getParkingRule(id) {
      const res = await getParkingRuleAPI(id);
      this.addForm = res.data;
    },
  },
};
</script>
<style lang="scss" scoped>
.form-container {
  padding: 0px 80px;
}
</style>
