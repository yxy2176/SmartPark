<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()">
          <i class="el-icon-arrow-left" />
          返回
        </span>
        <span>|</span>
        <span>{{ id ? "编辑角色" : "添加角色" }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <!-- v-if : 不频繁切换的时候使用 -->
      <!-- v-show ： 频繁切换的时候使用 -->
      <!-- 第一步：角色信息部分 -->
      <div class="form-container" v-show="activeStep === 1">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form
            class="form-box"
            ref="roleForm"
            :model="roleForm"
            :rules="roleRules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 第二步：权限信息部分 -->
      <div class="form-container" v-show="activeStep === 2">
        <div class="title">权限配置</div>
        <div class="form">
          <!-- 树形区域 -->
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <!-- title -->
              <div class="tree-title">{{ item.title }}</div>
              <!-- 树形结构 -->
              <!-- check-strictly 加上该属性时：点击父元素，子元素不会连带着一起被勾选上（解除父子集的关联） -->
              <el-tree
                ref="tree"
                :props="{ label: 'title' }"
                :data="item.children"
                show-checkbox
                check-strictly
                :default-expand-all="true"
                node-key="id"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 第三步：检查并完成部分 -->
      <div class="form-container" v-show="activeStep === 3">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="disabledTree"
                  :data="item.children"
                  show-checkbox
                  check-strictly
                  default-expand-all
                  node-key="id"
                  :props="{ label: 'title', disabled: () => true }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="prev" v-show="activeStep != 1">上一步</el-button>
        <el-button type="primary" v-show="activeStep != 3" @click="next">
          下一步
        </el-button>
        <el-button
          type="primary"
          v-show="activeStep == 3"
          @click="confirmAdd"
          >{{ id ? "确认更改" : "确认添加" }}</el-button
        >
      </div>
    </footer>
  </div>
</template>

<script>
import {
  createRoleUserAPI,
  getTreeListAPI,
  getRoleListDetailAPI,
  updateRoleUserAPI,
} from "@/api/system";
export default {
  name: "AddRole",
  data() {
    return {
      // 当前进入到的步数
      activeStep: 1,

      roleForm: {
        roleName: "",
        remark: "",
        perms: [],
      },
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入描述名称", trigger: "blur" },
        ],
      },
      treeList: [],
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  created() {
    this.getTreeList();
    if (this.id) {
      this.getRoleDetail();
    }
  },
  methods: {
    prev() {
      if (this.activeStep == 1) return;
      this.activeStep--;
    },
    next() {
      if (this.activeStep == 3) return;
      // 第一步的统一校验
      if (this.activeStep == 1) {
        this.$refs.roleForm.validate((flag) => {
          if (!flag) return;
          this.activeStep++;
        });
      } else if (this.activeStep == 2) {
        // 进入下一步之前应该加一点判断（比如：用户是否已经勾选了权限信息【一个都没勾选的话不让进入下一步】）
        const treeComponentList = this.$refs.tree;
        //   每次点击下一步之前，先清空perms中原有的数据
        this.roleForm.perms = [];
        treeComponentList.forEach((tree) => {
          this.roleForm.perms.push(tree.getCheckedKeys());
        });
        // console.log(this.roleForm.perms);
        if (this.roleForm.perms.flat().length <= 0) {
          this.$message({
            type: "error",
            message: "请至少选择一个权限点",
          });
          return;
        } else {
          // 如果长度不为零，进入到 第三步:检查并完成
          this.activeStep++;
          const disabledTreeList = this.$refs.disabledTree;
          //   console.log(disabledTreeList);

          disabledTreeList.forEach((tree, index) => {
            tree.setCheckedKeys(this.roleForm.perms[index]);
          });
        }
      }
    },

    async getTreeList() {
      const res = await getTreeListAPI();
      // console.log(res)
      this.treeList = res.data;
    },
    //   点击 确定添加 按钮
    async confirmAdd() {
      // 确认更改 时候的跳转
      if (this.id) {
        const res = await updateRoleUserAPI(this.roleForm);
          // console.log(res);
        this.$message.success("更改成功！");
        this.$router.back();
      } else {
        // 确认添加 时候的跳转
        await createRoleUserAPI(this.roleForm);
        this.$message.success("添加成功！");
        this.$router.back();
      }
    },

    async getRoleDetail() {
      const res = await getRoleListDetailAPI(this.id);
      //   console.log(res);
      const { perms, remark, roleId, roleName } = res.data;
      // 回填基础表单(不然res.data 打印出来多了一个属性userTotal,没办法直接传递给接口)
      this.roleForm = { perms, remark, roleId, roleName };
      //   回显第二步的树状结构的勾选状态
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys(this.roleForm.perms[index]);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.add-role {
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
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;
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
        }
        .info {
          font-size: 14px;
          color: #666;
          .form-item {
            margin-bottom: 20px;
          }
        }
      }
      .form-box {
        width: 600px;
        display: flex;
        flex-direction: column;
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
    z-index: 10001;
  }
  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .tree-item {
      flex: 1;
      padding: 0px 4px;
      text-align: center;
      .tree-title {
        background: #f5f7fa;
        text-align: center;
        padding: 10px 0;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
