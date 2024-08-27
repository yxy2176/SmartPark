<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"
          ><i class="el-icon-arrow-left" />返回</span
        >
        <span>|</span>
        <span>{{ id ? "编辑企业" : "添加企业" }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form
            ref="ruleForm"
            label-width="100px"
            :model="addForm"
            :rules="rules"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <!-- label为展示的文本内容 -->
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :label="item.industryName"
                  :value="item.industryCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseUrl">
              <!-- action是一个必传属性，配置的是上传文件的路径，但是不灵活（一般不用，都是自己上传） -->
              <!-- 但即使不用，也得配置，用#代替路径 -->
              <!-- 可以这样理解：  http-request为自定义上传，action为默认上传 -->
              <!-- before-upload 在上传前执行 -->
              <el-upload
                class="upload-demo"
                action="#"
                :http-request="uploadRequest"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary" @click="confirmAdd"
                  >点击上传</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png/jepg文件，且不超过5M
                </div>
              </el-upload>
              <img
                v-if="id"
                :src="addForm.businessLicenseUrl"
                style="width: 100px"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  addEnterpriseAPI,
  getEnterpriseDetailAPI,
  getIndustryListAPI,
  updateEnterpriseAPI,
} from "@/api/enterprise";
import { uploadFileAPI } from "@/api/common";
export default {
  name: "addEnterprise",
  data() {
    return {
      //添加企业的表单内容
      addForm: {
        name: "", // 企业名称
        legalPerson: "", // 法人
        registeredAddress: "", // 注册地址
        industryCode: "", // 所在行业
        contact: "", // 企业联系人
        contactNumber: "", // 联系人电话
        businessLicenseUrl: "", // 营业执照url
        businessLicenseId: "", // 营业执照id
      },

      // 可选的行业列表
      industryList: [],

      rules: {
        name: [{ required: true, message: "企业名称为必填", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "法人为必填", trigger: "blur" },
        ],
        registeredAddress: [
          { required: true, message: "注册地址为必填", trigger: "blur" },
        ],
        industryCode: [
          { required: true, message: "所在行业为必填", trigger: "change" },
        ],
        contact: [
          { required: true, message: "企业联系人为必填", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, message: "企业联系人电话为必填", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "电话格式不正确",
            trigger: "blur",
          },
        ],
        businessLicenseUrl: [
          { required: true, message: "请上传营业执照", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getIndustryList();
    //如果id有值
    if (this.id) {
      this.getEnterpriseDetail();
    }
  },

  computed: {
    id() {
      return this.$route.query.id;
    },
  },

  methods: {
    //获取企业详情
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailAPI(this.id);
      this.addForm = res.data;
    },
    //获取行业列表
    async getIndustryList() {
      const res = await getIndustryListAPI();
      this.industryList = res.data;
    },

    // 上传文件
    async uploadRequest(data) {
      //1. 上传逻辑
      //获得file，或者在参数处结构 => ({file})
      const file = data.file;
      const formData = new FormData();
      // formData追加数据 =>使用append方法
      formData.append("file", file);
      formData.append("type", 1);
      const res = await uploadFileAPI(formData);
      this.addForm.businessLicenseId = res.data.id;
      this.addForm.businessLicenseUrl = res.data.url;

      //2. 单独校验表单，清除错误信息 [因为el-upload不是基础的表单元素，不能自动清除错误信息]
      //用 businessLicenseId 也行
      this.$refs.addForm.validateField("businessLicenseUrl");
    },

    // 上传文件前的验证
    beforeUpload(file) {
      const imageType = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/svg+xml",
        "image/bmp",
      ];
      if (!imageType.includes(file.type)) {
        this.$message.warning("图片格式不正确");
        return false;
      }
      // 先转换为kb，再转换为mb
      // B / 1024(KB) / 1024(MB)
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("图片大小不能大于5M");
        return false;
      }
    },
    // 点击提交按钮 （校验）
    confirmAdd() {
      this.$refs.ruleForm.validate(async (flag) => {
        if (!flag) return;
        // console.log('可以请求接口了')
        if (this.id) {
          // addForm中多出来的三个字段，给后端传参的时候要把差异项删掉
          delete this.addForm.businessLicenseName;
          delete this.addForm.industryName;
          delete this.addForm.rent;
          await updateEnterpriseAPI(this.addForm);
        } else {
          await addEnterpriseAPI(this.addForm);
        }
        this.$message.success(`${this.id ? "更新成功" : "新增成功"}`);
        // 或者 this.$router.back()
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
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
