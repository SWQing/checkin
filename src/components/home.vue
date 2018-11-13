<template>
    <div class="container">
        <van-cell-group class="vanCell">
            <van-cell :value="date" is-link arrow-direction="down" @click="toggleModel('date')">
                <template slot="icon">
                    <div class="dateIcon iconBox"><img src="../../static/img/date.png" alt="date"></div>
                </template>
                <template slot="title">
                    <span class="van-cell-text">签到时间</span>
                </template>
                <template slot="right-icon">
                    <img class="openIcon" src="../../static/img/open.png" alt="date">
                </template>
            </van-cell>
            <van-cell :value="grade" is-link arrow-direction="down" @click="toggleModel('grade')">
                <template slot="icon">
                    <div class="classIcon iconBox"><img src="../../static/img/class.png" alt="class"></div>
                </template>
                <template slot="title">
                    <span class="van-cell-text">选择班级</span>
                </template>
                <template slot="right-icon">
                    <img class="openIcon" src="../../static/img/open.png" alt="date">
                </template>
            </van-cell>
            <van-cell :value="course" is-link arrow-direction="down" @click="toggleModel('course')">
                <template slot="icon">
                    <div class="bookIcon iconBox"><img src="../../static/img/book.png" alt="book"></div>
                </template>
                <template slot="title">
                    <span class="van-cell-text">选择课程</span>
                </template>
                <template slot="right-icon">
                    <img class="openIcon" src="../../static/img/open.png" alt="date">
                </template>
            </van-cell>
        </van-cell-group>
        <!-- 弹出层 -->
        <!-- date -->
        <van-popup v-model="showDate" position="bottom" >
            <van-datetime-picker type="date" 
                v-model="currentDate" 
                :max-date="maxDate"
                @confirm="changeDate"
                @cancel="toggleModel('date')"
                />
        </van-popup>
        <!-- grade -->
        <van-popup v-model="showGrade" position="bottom" >
            <van-picker 
                show-toolbar 
                :columns="gradeList" 
                @confirm="changeGrade" 
                @cancel="toggleModel('grade')"
                />
        </van-popup>
        <!-- course -->
        <van-popup v-model="showCourse" position="bottom" >
            <van-picker 
                show-toolbar 
                :columns="courseList" 
                @confirm="changeCourse" 
                @cancel="toggleModel('course')"
                />
        </van-popup>

        <!-- 考勤情况 -->
        <div class="detail">
            <div class="tab">
                <div class="tab-text">考勤情况</div>
                <ul class="tabs">
                    <li :class="activeLi ==  0 ? 'activeLi' : ''" @click="changeTab(0)">已到</li>
                    <li :class="activeLi ==  1 ? 'activeLi' : ''" @click="changeTab(1)">未到</li>
                </ul>
            </div>
            <table class="thead">
                <thead>
                    <td>选择</td>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>状态</td>
                </thead>
            </table>
            <div class="table-content" v-if="activeLi == 0">
                <table>
                    <tbody>
                        <tr v-for="(item, index) in comeList" :key="index" :class="item.checked == true ? 'selectTr' : ''" @click="checked(item.schoolNumber)">
                            <td><div class="radio"></div></td>
                            <td>{{item.schoolNumber}}</td>
                            <td>{{item.student}}</td>
                            <td>{{item.status}} {{item.isRetreat ? "早退" : ""}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-content" v-else>
                <table>
                    <tbody>
                        <tr v-for="(item, index) in unComeList" :key="index" :class="item.checked == true ? 'selectTr' : ''" @click="checked(item.schoolNumber)">
                            <td><div class="radio"></div></td>
                            <td>{{item.schoolNumber}}</td>
                            <td>{{item.student}}</td>
                            <td>{{item.status}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- btn -->
        <div class="btn">
            <div v-if="activeLi == 0" class="setLeave" @click="setEarlyLeave">{{selectedArr.length > 0 ? (!selectedArr[0].isRetreat ? '设置早退' : '取消早退') : '设置早退'}}</div>
            <!-- <div v-else class="btn-box"> -->
                <div v-if="activeLi == 1" class="setSick" @click="setLeave('sick')">设为病假</div>
                <div v-if="activeLi == 1" class="setThing" @click="setLeave('thing')">设为事假</div>
            <!-- </div> -->
        </div>
    </div>
</template>
<script>
import { formatTime } from '../../static/util/util.js'
import { Cell, CellGroup, Popup, Picker, DatetimePicker, Toast, Dialog } from 'vant'
import { userInfo } from 'os';
import { setTimeout } from 'timers';
import { fail } from 'assert';
// import { throws } from 'assert';
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [DatetimePicker.name]: DatetimePicker
    },
    data() {
        return {
            userInfo: null,
            date: formatTime(new Date(), 'YYYY-MM-DD'),
            showDate: false,
            currentDate: new Date(),
            maxDate: new Date(),

            grade: '',
            gradeList: [{values: [], defaultIndex: 0}],
            showGrade: false,
            
            course: '',
            courseList: [{values: [], defaultIndex: 0}],
            showCourse: false,

            activeLi: 0,
            selectedArr: [],//已选择
            comeList: [],//已到
            unComeList: [],//未到
        }
    },
    mounted() {
        // 判断登录
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        console.log(userInfo);
        if(userInfo == null || userInfo == undefined || userInfo == '') {
            this.$router.push({path: '/login'})
        } else {
            this.userInfo = userInfo;
            // 获取数据、初始化
            this.getData();
        }
        Toast.setDefaultOptions({
            duration: 1500
        })
    },
    methods: {
        // 显示/隐藏选择框
        toggleModel(e) {
            if(e == 'date') {
                this.showDate = !this.showDate;
            } else if(e == 'grade') {
                this.showGrade = !this.showGrade;
            } else {
                this.showCourse = !this.showCourse;
            }
        },
        // 切换日期
        changeDate(e) {
            this.date = formatTime(e, 'YYYY-MM-DD');
            this.showDate = false;
            this.getData();
        },
        // 切换班级
        changeGrade(e) {
            this.grade = e[0];
            this.showGrade = false;
            this.getData();
        },
        // 切换课程
        changeCourse(e) {
            this.course = e[0];
            this.showCourse = false;
            this.getData();
        },
        // tab切换
        changeTab(e) {
            this.activeLi = e;
        },
        // 选中学生
        checked(e) {
            if(this.activeLi == 0) {
                console.log(this.selectedArr);
                this.comeList.forEach((item) => {
                    // 选中数组长度大于 0
                    if(this.selectedArr.length > 0) {
                        if(item.schoolNumber == e && (this.selectedArr[0].isRetreat == item.isRetreat)) {
                            item.checked = !item.checked;
                            if(!item.checked) {
                                // 取消选择
                                // 移除数组中对应的项
                                this.selectedArr.forEach((selectItem, index) => {
                                    if(selectItem.schoolNumber == item.schoolNumber) {
                                        this.selectedArr.splice(index, 1);
                                    }
                                })
                            } else {
                                this.selectedArr.push(item);
                            }
                        }
                    } else {
                        // 等于0
                        if(item.schoolNumber == e) {
                            item.checked = !item.checked;
                            this.selectedArr.push(item);
                        }
                    }
                })
            } else {
                this.unComeList.forEach((item) => {
                    if(item.schoolNumber == e && item.status == '未到') {
                        item.checked = !item.checked;
                    }
                })
            }
        },
        // 发起请求获取所有数据
        getData() {
            let that = this;
            Toast.loading({
                mask: true,
                message: '正在加载...',
                duration: 0
            });
            let params = {
                teacher: this.userInfo.name,
                date: this.date,
                cour: this.course,
                clas: this.grade
            }
            this.$axios.post('/attendance/show', params).then((data) => {
                console.log(data);
                Toast.clear();
                if(data.resultCode == 200) {
                    // 班级
                    this.gradeList[0].values = data.resultContent.sClasses;
                    this.gradeList[0].values.forEach((item, index) => {
                        if(item == data.resultContent.clas) {
                            that.gradeList[0].defaultIndex = index;
                        }
                    })
                    if(data.resultContent.clas == '') {
                        this.grade = data.resultContent.sClasses[0];
                    } else {
                        this.grade = data.resultContent.clas;
                    }
                    // 课程
                    this.courseList[0].values = data.resultContent.sCourses;
                    this.courseList[0].values.forEach((item, index) => {
                        if(item == data.resultContent.cour) {
                            that.courseList[0].defaultIndex = index;
                        }
                    })
                    if(data.resultContent.cour == '') {
                        this.course = data.resultContent.sCourses[0];
                    } else {
                        this.course = data.resultContent.cour;
                    }
                    // 学生列表
                    let comeList = [], unComeList = [];
                    data.resultContent.attendances.forEach((item) => {
                        item.checked = false;
                        if(item.status == '未到' || item.status == '事假' || item.status == '病假') {
                            unComeList.push(item);
                        } else {
                            comeList.push(item);
                        }
                    })
                    this.comeList = comeList;
                    this.unComeList = unComeList;
                } else {
                    Toast.fail(data.resultMsg);
                }
            }).catch(err => {
                Toast.clear();
                Toast.fail('请求出错');
            })
        },
        // 设置请假
        setLeave(e) {
            // on confirm
            let ids = [];
            this.unComeList.forEach((item) => {
                if(item.checked) {
                    ids.push(item.id);
                }
            })
            if(ids.length == 0) {
                Toast.fail('请先选择学生');
                return;
            }
            let text = (e == 'thing') ? '事假' : '病假';
            Dialog.confirm({
                title: '是否确定设为' + text + '？',
                message: '',
                className: 'confirm'
            }).then((res) => {
                let params = {
                    ids: ids + '',
                    status: e
                }
                Toast.loading({
                    mask: true,
                    message: '正在更改...',
                    duration: 0
                })
                this.$axios.post('/attendance/changeStatus', params).then((data) => {
                    Toast.clear();
                    if(data.resultCode == 200) {
                        this.unComeList.forEach((item) => {
                            if(item.checked) {
                                if(e == 'sick') {
                                    item.status = '病假';
                                } else {
                                    item.status = '事假'
                                }
                                item.checked = false;
                            }
                        })
                        Toast.success('更改成功');
                    } else {
                        Toast.fail(data.resultMsg);
                    }
                }).catch(err => {
                    // console.log(err);
                    Toast.clear();
                    Toast.fail('请求出错')
                })
            }).catch(() => {
                // on cancel
                
            });
        },
        // 设置早退
        setEarlyLeave() {
            let ids = [];
            this.comeList.forEach(item => {
                if(item.checked) {
                    ids.push(item.id);
                }
            })
            if(ids.length == 0) {
                Toast.fail('请先选择学生');
                return;
            }
            Toast.loading({
                mask: true,
                message: '正在更改...',
                duration: 0
            })
            this.$axios.post('/attendance/retreat', {ids: ids + ''}).then(data => {
                console.log(data);
                Toast.clear();
                if(data.resultCode == 200) {
                    this.comeList.forEach(item => {
                        if(item.checked) {
                            item.isRetreat = !item.isRetreat;
                        }
                    })
                    Toast.success('更改成功');
                } else {
                    Toast.fail(data.resultMsg);
                }
            }).catch(err => {
                Toast.clear();
                Toast.fail('请求出错');
            })
        }
    }
}
</script>
<style scoped>
    .container {
        height: 100vh;
    }
    .vanCell {
        height: 133px;
    }
    .detail {
        height: calc(100% - 183px);
    }
    .iconBox {
        width: 20px;
        display: flex;
        align-items: center;
    }
    .dateIcon img {
        width: 14px;
    }
    .classIcon img, .bookIcon img {
        width: 16px;
    }
    .openIcon {
        width: 12px;
        margin-left: 12px;
    }
    .van-cell-text {
        font-size: 15px;
        color: #666;
        margin-left: 5px;
    }
    .van-cell {
        display: flex;
        align-items: center;
    }
    .van-cell {
        font-size: 16px;
        color: #444;
    }
    .van-cell-group {
        box-shadow: 0 1px 1px 0 rgba(0,0,0,0.10);
    }

    .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #F7F7F7;
        padding: 0 15px;
        height: 57px;
        line-height: 57px;
    }
    .tab-text {
        font-size: 15px;
        color: #666;
    }
    .tabs {
        display: flex;
        align-items: center;
    }
    .tabs li {
        width: 52px;
        border: 1px solid #ccc;
        margin-left: 20px;
        text-align: center;
        /* padding: 10px 0; */
        height: 26px;
        line-height: 26px;
        border-radius: 22px;
        font-size: 14px;
        color: #999;
        padding-top: 1px;
        box-sizing: border-box;
    }
    .tabs .activeLi {
        border: 1px solid transparent;
        background-color: #57A4FB;
        color: #fff;
    }

    .table-content {
        height: calc(100% - 105px);
        overflow: auto;
    }
    .thead {
        height: 47px;
    }
    .thead thead {
        height: 100%;
    }
    table {
        width: 100%;
        text-align: center;
        table-layout: fixed;
        border-collapse: collapse;
        background-color: #fff;
    }
    table thead {
        color: #666;
        font-size: 14px;
    }
    table thead td, table tr {
        /* padding: 12px; */
        height: 55px;
    }
    table tr {
        font-size: 16px;
        color: #333;
    }
    table td {
        border-bottom: 1px solid #eee;
        padding: 12px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        /* height: 100%; */
    }
    table thead td:nth-of-type(1), table tr td:nth-of-type(1) {
        width: 15%;
        position: relative;
    }
    table thead td:nth-of-type(2), table tr td:nth-of-type(2) {
        width: 30%;
    }
    table thead td:nth-of-type(3), table tr td:nth-of-type(3) {
        width: 25%;
    }
    table thead td:nth-of-type(4), table tr td:nth-of-type(4) {
        width: 30%;
    }
    table .selectTr {
        background-color: #57A4FB;
        color: #fff;
    }
    table .radio {
        width: 16PX;
        height: 16PX;
        border: 1px solid #333;
        border-radius: 50%;
        margin: 0 auto;
        box-sizing: border-box;
        position: absolute;
        left: calc(50% - 8px);
        top: calc(50% - 8px);
    }
    table .selectTr .radio {
        border-color: #fff;
    }
    table .selectTr .radio::before {
        content: '';
        width: 4px;
        height: 4px;
        background-color: #fff;
        border-radius: 100px;
        position: absolute;
        left: calc(50% - 2px);
        top: calc(50% - 2px);
    }

    .btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #fff;
        font-size: 18px;
    }
    .btn > div {
        flex-grow: 1;
        height: 100%;
        text-align: center;
        line-height: 50px;
    }
    .setLeave {
        background-color: #FB5757;
    }
    .setSick {
        background-color: #FBA857;
    }
    .setThing {
        background-color: #FBCD57;
    }

    .confirm {
        text-align: center;
    }
    .confirm .van-dialog__message {
        text-align: center;
    }
</style>


