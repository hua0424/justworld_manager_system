<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>短信配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="showAdd">新增</el-button>
                <el-button type="danger" icon="el-icon-search" @click="handleDelete">删除</el-button>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-input v-model="search_cond.id" placeholder="短信ID"  style="width: 100px;" clearable class="handle-input mr10"></el-input>
                <el-input v-model="search_cond.templateName" placeholder="短信标题"  style="width: 200px;" clearable class="handle-input mr10"></el-input>
                <el-input v-model="search_cond.content" placeholder="短信模板"  style="width: 200px;" clearable class="handle-input mr10"></el-input>
            </div>
            <el-table :data="list" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="templateName" label="名称" width="120"></el-table-column>
                <el-table-column prop="content" label="短信模板" show-overflow-tooltip=true></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="showEdit(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="getData"
                               :current-page.sync="pageNum" :page-size.sync="pageSize"
                               @current-change="getData"
                               layout="sizes,prev, pager, next,total" :total="total"></el-pagination>
            </div>
        </div>

        <el-dialog :title="dialogTitle[dialogIndex]" :visible.sync="editVisible" width="40%">
            <el-form :model="form" label-width="100px" ref="smsTemplateForm">
                <el-form-item label="ID"  :required="true" >
                    <el-input v-model="form.id" :disabled.sync="idInputDisable"></el-input>
                </el-form-item>
                <el-form-item label="名称" :required="true">
                    <el-input v-model="form.templateName" placeholder="请输入短信标题" ></el-input>
                </el-form-item>
                <el-form-item label="短信模板" :required="true">
                    <el-input type="textarea" placeholder="请输入短信内容，要替换的链接请以<<链接地址>>编写"  v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'aiSmsJobList',
        data() {
            return {
                url: "/smsTemplate",
                list: [],
                pageNum: 1,
                pageSize: 15,
                multipleSelection: [],
                total:1,
                search_cond:{
                    id:'',
                    templateName:'',
                    content:'',
                },
                dialogIndex:"add",
                dialogTitle:{
                    add:"新增",
                    edit:"编辑"
                },
                form:{
                    id:'',
                    templateName:'',
                    content:'',
                },
                editVisible: false,
                idInputDisable:true
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$req.post(this.url+"/queryList/"+this.pageNum+"/"+this.pageSize,
                    this.search_cond).then((res) => {
                    this.list = res.data.data.list
                    this.total = res.data.data.total
                })
            },
            search() {
                this.pageNum=1;
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleDelete(){
                if(this.multipleSelection.length==0)return;
                this.$req.post(this.url+"/batchDelete",
                    this.multipleSelection.map(v=>{return v.id})).then((res) => {
                        if(res.data.rtcd=="0") {
                            this.$message.success('操作成功');
                        } else {
                            this.$message.error('操作失败:'+res.data.msg);
                        }
                    this.getData();
                })
            },
            showAdd(){
                this.dialogIndex="add";
                this.idInputDisable=false;
                this.editVisible=true;
            },
            showEdit(row){
                this.dialogIndex="edit";

                for (let formKey in this.form) {
                    this.form[formKey] = row[formKey];
                }

                this.idInputDisable=true;
                this.editVisible=true;
            },
            handleSave(){
                let url = this.url+"/add";
                if("edit" == this.dialogIndex){
                    url = this.url+"/update";
                }
                this.$req.post(url,this.form).then((res) => {
                    if(res.data.rtcd=="0") {
                        this.$message.success('操作成功');
                        this.getData();
                    } else {
                        this.$message.error('操作失败:'+res.data.msg);
                    }
                }).finally(()=>{
                    this.editVisible = false;
                    for (let formKey in this.form) {
                        this.form[formKey] = '';
                    }
                })
            },

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
        width: 100%;
        font-size: 14px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand >>> label {
        width: 120px;
        color: #99a9bf;
        text-align: left;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
