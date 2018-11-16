<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>短信渠道规则配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row :gutter="20">
            <el-col :span="24"><div class="grid-content container">
                <span style="margin-right: 10px">配置区域发送规则</span>
                <el-cascader class="handle-box"
                             placeholder="输入省市名"
                             :options="area.area_options"
                             filterable
                             clearable
                             change-on-select
                             :props="area.option_props"
                             v-model="area.select"
                             @change="onAreaSelectChange"
                ></el-cascader>
                <template>
                    <el-transfer
                        @change="handleAreaRuleChange"
                        :titles="['可选渠道','已选渠道']"
                        v-model="area.dispatchers"
                        :props="{key:'dispatcherKey',label:'name'}"
                        :data="sms_dispatcher_list"></el-transfer>
                </template>
            </div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24"><div class="grid-content container">
                <span style="margin-right: 10px">配置运营商发送规则</span>
                <el-select v-model="operator.select" placeholder="请选择运营商" @change="onOperatorChange"  class="handle-box">
                    <el-option
                        v-for="item in operator.options"
                        :key="item.dicInfo"
                        :label="item.dicName"
                        :value="item.dicInfo">
                    </el-option>
                </el-select>
                <template>
                    <el-transfer
                        @change="handleOperatorRuleChange"
                        :titles="['可选渠道','已选渠道']"
                        :props="{key:'dispatcherKey',label:'name'}"
                        v-model="operator.dispatchers"
                        :data="sms_dispatcher_list"></el-transfer>
                </template>
            </div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8"><div class="grid-content container">
                <div class="handle-box">
                    <span style="margin-right: 10px">配置AI用户名发送规则</span>
                </div>
                <div class="handle-box">
                    <el-input v-model="username.search_words" placeholder="搜索用户名"  style="width: 160px; margin-right: 10px;" clearable class="handle-input"></el-input>
                    <el-button type="primary" icon="el-icon-add" @click="addUsername">新增用户名</el-button>
                </div>
                <el-table :data="username_list" border class="table"
                          height="200"
                          highlight-current-row
                          @current-change="onAiUsernameRuleChange">
                    <el-table-column prop="dicName" label="用户名" ></el-table-column>
                </el-table>
            </div></el-col>
            <el-col :span="16"><div class="grid-content container" style="height: 295px;">
                <template>
                    <el-transfer
                        @change="handleAiUsernameRuleChange"
                        :titles="['可选渠道','已选渠道']"
                        :props="{key:'dispatcherKey',label:'name'}"
                        v-model="username.dispatchers"
                        :data="sms_dispatcher_list"></el-transfer>
                </template>
            </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import {TreeUtil} from "@/api/tree.js"
    import querystring from 'querystring'

    export default {
        name: 'areaConfig',
        data() {
            return {
                dispatcher_list_url:process.env.BASE_URL+"/smsDispatcher/queryList",
                sms_rule_url:process.env.BASE_URL+"/aismsrule",
                sms_dispatcher_list:[],
                area: {
                    url: process.env.BASE_URL+"/commoninfo/region/queryRegionList/2",
                    area_tree:{},
                    area_options: [],
                    dispatchers:[""],
                    option_props:{
                        value:'id',
                        label:'name'
                    },
                    select:[]
                },
                operator:{
                    url: process.env.BASE_URL+"/commoninfo/dic/getDic",
                    options:[],
                    select:"",
                    dispatchers:[""],
                    select:[]
                },
                username:{
                    url: process.env.BASE_URL+"/commoninfo/dic",
                    search_words:"",
                    list:[{id:"1",dicName:"myai"}],
                    dispatchers:[""],
                    select:[]
                }
            }
        },
        computed:{
            username_list(){
                return this.username.list.filter((u)=>{
                    if(u.dicName.indexOf(this.username.search_words)>=0)return u;
                })
            }
        },
        created() {
            this.getAreaList();
            this.getOperatorList();
            this.getUsernameList();
            this.getSmsDispatcherList();
        },
        methods: {
            getAreaList() { //查询省市列表
                this.$axios.post(this.area.url,
                    {}).then((res) => {
                    this.area.area_tree = new TreeUtil(res.data.data, "id", "parentId", null);
                    this.area.area_options = this.area.area_tree.getTree();
                }).catch(error => {
                    this.$message.success('err' + error.message)
                })
            },
            addUsername() { //新增用户名
                this.$prompt('请输入要新增的用户名', '新增用户名', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    this.$axios.post(this.username.url+"/addAiUsername",
                        {dicName:value}).then((res) => {
                        this.getUsernameList();
                        this.$message({
                            type: 'success',
                            message: '成功新增用户名: ' + value
                        });
                    }).catch(error => {
                        this.$message.success('请求失败:' + error.message)})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消新增用户名'
                    });
                });
            },
            getUsernameList() { //查询AI用户名列表
                this.$axios.post(this.username.url+"/getDic/AI_USERNAME",
                    {}).then((res) => {
                    this.username.list = res.data.data
                }).catch(error => {
                    this.$message.success('err' + error.message)})
            },
            getOperatorList() { //查询运营商列表
                this.$axios.post(this.operator.url+"/PHONE_OPERATOR",
                    {}).then((res) => {
                        this.operator.options = res.data.data;
                }).catch(error => {
                    this.$message.success('err' + error.message)})
            },
            getSmsDispatcherList() {    //获取可用短信渠道列表
                this.$axios.post(this.dispatcher_list_url,
                    {}).then((res) => {
                    this.sms_dispatcher_list = res.data.data;
                }).catch(error => {
                    this.$message.success('err' + error.message)})
            },
            onAreaSelectChange(val) {   //区域选择变化事件
                if (this.area.select.length == 0) return;
                let selectNode = this.area.area_tree.getNode(this.area.select[this.area.select.length - 1]);
                this.changeRuleShow(selectNode.levelName,selectNode.name,this.area);
            },
            onOperatorChange(val){
                if (this.operator.select.length == 0) return;
                this.changeRuleShow('OPERATOR',this.operator.select[0],this.operator);
            },
            onAiUsernameRuleChange(val){
                this.username.select = val.dicName;
                if (this.username.select=="") return;
                this.changeRuleShow('AI_USERNAME',this.username.select,this.username);
            },
            changeRuleShow(ruleType,ruleKey,field){
                this.$axios.post(this.sms_rule_url+"/queryList",
                    {
                        ruleType:ruleType,
                        ruleKey:ruleKey
                    }).then((res) => {
                        //如果是空，则所有都到目标中
                        if(res.data.data==null||res.data.data.length==0){
                            field.dispatchers=this.sms_dispatcher_list.map(v=>{
                                return v.dispatcherKey;
                            })
                        }else{  //筛选
                            field.dispatchers=res.data.data.map(v=>{
                                return v.dispatcherKey;
                            })
                        }

                }).catch(error => {
                    this.$message.success('err' + error.message)})
            },
            handleAreaRuleChange(current,direction,change) { //区域规则配置变化
                if (this.area.select.length == 0) return;
                let selectNode = this.area.area_tree.getNode(this.area.select[this.area.select.length-1]);
                this.changeRule(current,selectNode.levelName,selectNode.name);
            },
            changeRule(selectKeyArray,ruleType,ruleKey){
                if(!ruleKey||ruleKey=="")return;
                //构造新对象数组
                let ruleList = selectKeyArray.map(v=>{
                    return {
                        dispatcherKey:v,
                        ruleType:ruleType,
                        ruleKey:ruleKey
                    }
                });
                this.$axios.post(this.sms_rule_url+"/update",
                    ruleList).then((res) => {
                        console.log(JSON.stringify(res.data));
                        this.$message.success('操作成功')
                }).catch(error => {
                    this.$message.success('err' + error.message)})

            },
            handleOperatorRuleChange(current,direction,change){ //运营商规则配置变化
                this.changeRule(current,"OPERATOR",this.operator.select[0]);
            },
            handleAiUsernameRuleChange(current,direction,change){ //ai用户名规则配置变化
                this.changeRule(current,"AI_USERNAME",this.username.select);
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-input {
        display: inline-block;
    }
    .table{
        font-size: 14px;
        width: 100%;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .el-row {
        margin-bottom: 20px;
    }
</style>
