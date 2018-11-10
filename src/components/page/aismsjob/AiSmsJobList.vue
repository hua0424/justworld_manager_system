<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>AI挂机任务列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search_cond.id" placeholder="ID"  style="width: 100px;" clearable class="handle-input mr10"></el-input>
                <el-input v-model="search_cond.phone" placeholder="手机号"  style="width: 200px;" clearable class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="list" border class="table">
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="phone" label="号码" width="120"></el-table-column>
                <el-table-column prop="aiUsername" label="AI用户名" width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
                <el-table-column prop="clickCount" label="点击量" width="65"></el-table-column>
                <el-table-column label="号码识别" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.phoneStatus | formatPhoneHandleStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="短链状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shortUrlStatus | formatShortUrlHandleStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="任务状态" >
                    <template slot-scope="scope">
                        <span>{{ scope.row.status | formatAiSmsJobStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column type="expand" label="详细" width="60">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="最后点击时间">
                                <span>{{ props.row.clickTime }}</span>
                            </el-form-item>
                            <el-form-item label="短信模板号">
                                <span>{{ props.row.smsTemplateId }}</span>
                            </el-form-item>
                            <el-form-item label="短信链接">
                                <span>{{ props.row.smsTemplateUrl }}</span>
                            </el-form-item>
                            <el-form-item label="替换短链">
                                <span>{{ props.row.smsShortUrl }}</span>
                            </el-form-item>
                            <el-form-item label="运营商">
                                <span>{{ props.row.telOperator | formatOperator }}</span>
                            </el-form-item>
                            <el-form-item label="区域">
                                <span>{{ props.row.province }}{{ props.row.city }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-refresh">重启</el-button>
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

    </div>
</template>

<script>
    import * as filters from "@/api/formatter.js"
    export default {
        name: 'aiSmsJobList',
        data() {
            return {
                url: process.env.BASE_URL+"/aismsjob/queryList",
                list: [],
                pageNum: 1,
                pageSize: 15,
                multipleSelection: [],
                total:1,
                search_cond:{
                    id:'',
                    phone:'',
                },
                refresh_list: [],
                is_search: false
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.post(this.url+"/"+this.pageNum+"/"+this.pageSize,
                    {id:this.search_cond.id,phone:this.search_cond.phone}).then((res) => {
                    this.list = res.data.data.list
                    this.total = res.data.data.total
                }).catch(error => {
                    this.$message.success('err' + error.message)})
            },
            search() {
                this.pageNum=1;
                this.getData();
            },
        },
        filters:filters
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
