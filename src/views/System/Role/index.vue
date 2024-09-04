<template>
  <div class="role-container">
    <!-- 左侧区域 -->
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: activeIndex === index }"
        @click="changeRole(index)"
      >
        <div class="role-info">
          <svg-icon
            :icon-class="activeIndex === index ? 'user-active' : 'user'"
            class="icon"
          />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="$router.push(`/sys/addRole?id=${item.roleId}`)"
              >
                编辑角色
              </el-dropdown-item>
              <el-dropdown-item @click.native="delRoleUser(item.roleId)"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button
        class="addBtn"
        size="mini"
        @click="$router.push('/sys/addRole')"
        >添加角色</el-button
      >
    </div>

    <!-- 右侧区域 -->
    <div class="right-wrapper">
      <!-- 标签页区域 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <!-- 树形区域 -->
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <!-- title -->
              <div class="tree-title">{{ item.title }}</div>
              <!-- 树形结构 -->
              <el-tree
                ref="tree"
                :props="{ label: 'title' }"
                :data="item.children"
                show-checkbox
                :default-expand-all="true"
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员列表(${total})`" name="member">
          <el-table :data="roleUserList" style="width: 100%">
            <el-table-column type="index" width="250" label="序号" />
            <el-table-column prop="name" label="员工姓名" />
            <el-table-column prop="userName" label="登录账号" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getRoleListAPI,
  getRoleListDetailAPI,
  getRoleUserListAPI,
  getTreeListAPI,
  delRoleUserAPI,
} from "@/api/system";

export default {
  name: "Role",
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      // 存储所有的权限列表
      treeList: [],
      perms: [], // 当前角色权限点列表
      activeName: "tree", // 默认打开tree
      params: {
        page: 1,
        pageSize: 2,
      },
      total: 0,
      roleUserList: [],
    };
  },
  // 生命周期里先以第一项roleId获取
  async created() {
    // 先获取角色列表和可选权限列表
    await this.getRoleList();
    await this.getTreeList();
    // 再获取当前角色下的权限列表
    this.getRoleListDetail(this.roleList[0].roleId);
  },
  methods: {
    // 从后端接口获取左侧的角色列表
    async getRoleList() {
      const res = await getRoleListAPI();
      this.roleList = res.data;
      //   console.log(res)
    },

    //   点击哪个角色时，获得其索引值
    changeRole(index) {
      this.activeIndex = index;
      const roleId = this.roleList[index].roleId;
      //   获取角色回显的（树状上的）权限信息
      this.getRoleListDetail(roleId);
      //   获取角色回显的成员信息
      this.getRoleUserList(roleId);
    },
    async getTreeList() {
      const res = await getTreeListAPI();
      this.treeList = res.data;
      //   console.log(res);
      this.addDisabled(this.treeList);
      //   console.log(res);
    },
    // 递归处理函数 ->让每个tree节点都设置为禁用状态
    addDisabled(treeList) {
      treeList.forEach((item) => {
        item.disabled = true;
        //递归遍历其子孙
        if (item.children) this.addDisabled(item.children);
      });
    },
    async getRoleListDetail(roleId) {
      const res = await getRoleListDetailAPI(roleId);
      //   高亮的权限列表
      this.perms = res.data.perms;
      const treeComponentList = this.$refs.tree;
      // 调用setCheckedKeys方法 ： 高亮方法
      treeComponentList.forEach((tree, index) => {
        tree.setCheckedKeys(this.perms[index]);
      });
    },
    async getRoleUserList(roleId) {
      const res = await getRoleUserListAPI(roleId, this.params);
      //   console.log(res);
      this.total = res.data.total;
      this.roleUserList = res.data.rows;
    },
    async delRoleUser(roleId) {
      this.$confirm("您确定要删除该角色吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delRoleUserAPI(roleId);
        this.getRoleList();
        this.$message.success("删除成功!");
      });
    },
  },
};
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
