<template>
    <div class="body">
        <form class="loginBox">
            <div class="title">欢迎</div>
            <div class="inputBox">
                <input type="text" placeholder="用户名" v-model.trim:value="username">
                <input type="password" placeholder="密码" v-model.trim:value="password">
            </div>
            <!-- <div class="select">
                <div class="checkbox" @click="checkbox">
                    <img v-if="checked" src="../../static/img/checkbox_1.png" alt="checkbox">
                    <img v-else src="../../static/img/checkbox.png" alt="checkbox">
                    <div class="remember">记住密码</div>
                </div>
                <div class="forget">忘记密码？</div>
            </div> -->
            <div class="btn"><input type="submit" value="登录" @click="login"></div>
        </form>
    </div>
</template>
<script>
import { Toast } from 'vant'
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            checkboxImg: '../../static/img/checkbox.png',
            checked: false,
            username: '',
            password: ''
        }
    },
    mounted() {
        document.title = '登录';
    },
    methods: {
        checkbox() {
            this.checked = !this.checked;
        },
        login(event) {
            event.preventDefault();
            let params = {
                userName: this.username,
                password: this.password
            }
            console.log(params);
            if(params.userName == '') {
                Toast.fail('请输入用户名');
                return;
            } else if(params.password == '') {
                Toast.fail('请输入密码');
                return;
            }
            this.$axios.post('/teacher/login', params).then((data) => {
                console.log(data);
                if(data.resultCode == 200) {
                    Toast.success('登录成功');
                    window.sessionStorage.setItem('userInfo', JSON.stringify(data.resultContent));
                    setTimeout(() => {
                        Toast.clear();
                        this.$router.push({path: '/'});
                    }, 1000)

                } else {
                    Toast.fail(data.resultMsg);
                }
            }).catch(err => {
                Toast.fail('请求失败');
            })

        }
    }
}
</script>
<style scoped>
    .body {
        height: 100%;
        background: url(../../static/img/bg.png) no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .loginBox {
        width: 340px;
        /* height: 340px; */
        background-color: #fff;
        border-radius: 8px;
        padding: 13px;
        box-sizing: border-box;
    }
    .title {
        font-size: 25px;
        color: #4a4a4a;
        text-align: center;
        margin: 18px 0 31px;
    }
    .inputBox input {
        border: 1px solid #f3f3f3;
        border-radius: 4px;
        padding: 12px 17px;
        box-sizing: border-box;
        width: 312px;
        height: 44px;
        margin-bottom: 15px;
        font-size: 15px;
        color: #9b9b9b;
    }
    .select {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        margin-top: 6px;
    }
    .select .checkbox {
        display: flex;
        align-items: center;
    }
    .select .checkbox img {
        width: 22px;
        height: 22px;
    }
    .remember {
        color: #4a4a4a;
        margin-left: 9px;
    }
    .forget {
        color: #999;
    }
    .btn {
        margin: 30px 0 5px;
    }
    .btn input {
        width: 312px;
        height: 44px;
        font-size: 15px;
        background-color: #57A4FB;
        color: #fff;
        border-radius: 20px;
        outline: none;
        border: none;
    }
</style>


