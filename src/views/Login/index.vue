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

                <el-form-item>
                    <el-checkbox v-model="rememberMe">记住我</el-checkbox>
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
import { FORM_KEY } from '@/constants/KEY'

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
            rememberMe: true,
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
    created() {
        const loginData = localStorage.getItem(FORM_KEY)
        //先判断有没有用户信息
        if (loginData) {
            const { username, password } = JSON.parse(loginData)
            this.loginForm.username = username
            this.loginForm.password = password
        }

    },
    methods: {
        handleLogin() {
            //或者 this.$refs['form']
            this.$refs.form.validate(async (flag) => {
                // console.log(flag)
                if (!flag) return
                console.log('可以提交接口了！')
                try {
                    await this.$store.dispatch('user/loginAction', this.loginForm)
                    //判断用户是否点击了记住我
                    if (this.rememberMe) {
                        localStorage.setItem(FORM_KEY, JSON.stringify(this.loginForm))
                    } else {
                        localStorage.removeItem(FORM_KEY)
                    }
                    //实现从哪个页面退出的，就在登陆的时候继续跳转到对应的页面
                    if (this.$route.query.redirect) {
                        this.$router.push(this.$route.query.redirect)
                    } else {
                        this.$router.push('/')
                    }
                } catch (error) {
                    console.dir(error)
                    this.$message.error(error.response.data.msg)
                }
                //越过了Action直接commit了
                // const res = await loginAPI(this.loginForm)
                // this.$store.commit('user/setToken',res.data.token)

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
