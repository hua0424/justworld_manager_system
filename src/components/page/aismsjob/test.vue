<template>
<div>
    <el-row :gutter="20">
        <el-col :span="16"><div class="grid-content bg-purple">
            <el-table :data="province.list" border class="table"
                      highlight-current-row
                      @current-change="handleSelectionChange">
                <el-table-column prop="province" label="省份" width="150"></el-table-column>
            </el-table></div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
            <el-transfer
                :titles="['可选渠道','已选渠道']"
                v-model="province.option_dispatchers"
                :data="province.data"></el-transfer></div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
            <el-table ></el-table></div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
            <el-table ></el-table></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
</div>
</template>
<script>
    export default {
        name: 'aiSmsJobList',
        data() {
            return {
                province: {
                    url: process.env.BASE_URL + "/aismsjob/queryList",
                    list: [{province: "广西"}, {province: "广东"}],
                    data: [
                        {key: "1", label: "移动"},
                        {key: "2", label: "联通"},
                        {key: "3", label: "电信"}
                    ],
                    option_dispatchers: ["3"],
                    current: "广西"
                },
                city: {
                    url: process.env.BASE_URL + "/aismsjob/queryList",
                    list: [{province: "南宁"}, {province: "柳州"}],
                    selected_dispatchers: [{key: "1", text: "移动"}, {key: "2", text: "联通"}],
                    option_dispatchers: [{key: "3", text: "电信"}],
                    current: "南宁"
                },

                url: process.env.BASE_URL + "/aismsjob/queryList",
            }
        }
    }

</script>
    <style>
        .el-row {
            margin-bottom: 20px;
        &:last-child {
             margin-bottom: 0;
         }
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
    </style>
