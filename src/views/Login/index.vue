<template>
    <div class="login_body">
        <div class="bg" />
        <div class="box">
            <div class="title">智慧园区-登录</div>
            <el-form ref="form" :model="loginForm" :rules="loginRules">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="loginForm.username" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" />
                </el-form-item>

                <el-form-item >
                    <el-checkbox >记住我</el-checkbox>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="login_btn" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { loginAPI } from '@/api/user'

export default {
    name: 'Login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('Please enter the correct user name'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('The password can not be less than 6 digits'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',
                password: '',
            },
            loginRules: {
                username: [
                    { required: true, trigger: 'blur', validator: validateUsername }
                ],
                password: [
                    { required: true, trigger: 'blur', validator: validatePassword }
                ],
            }

        }

    },
    methods: {
        handleLogin() {
            //或者 this.$refs['form']
            this.$refs.form.validate(async(flag) => {
                // console.log(flag)
                if (!flag) return
                console.log('可以提交接口了！')
                //越过了Action直接commit了
                    // const res = await loginAPI(this.loginForm)
                    // this.$store.commit('user/setToken',res.data.token)
                this.$store.dispatch('user/loginAction',this.loginForm)
                // console.log(res)
            })
        }
    }

}

</script>

<style scoped lang="scss">
.login_body {
    display: flex;
}

.bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
}

.box {
    margin: 200px 10% 0;
    flex: 1;

    .title {
        padding-bottom: 76px;
        font-size: 26px;
        font-weight: 500;
        color: #1e2023;
    }

    ::v-deep() {
        .ant-form-item {
            display: flex;
            margin-bottom: 62px;
            flex-direction: column;
        }

        .ant-form-item-label label {
            font-size: 16px;
            color: #8b929d;
        }

        .ant-input,
        .ant-input-password {
            border-radius: 8px;
        }
    }
}

.login_btn {
    width: 100%;
}
</style>
