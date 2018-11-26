<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>平台参数配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border class="table">
                <el-table-column prop="name" label="名称" sortable width="200">
                </el-table-column>
                <el-table-column prop="desc" label="描述" width="400">
                </el-table-column>
                <el-table-column label="参数值" min-width="300px" >
                    <template slot-scope="scope">
                        <template v-if="scope.row.edit">
                            <el-input v-model="scope.row.cfgValue" class="edit-input" size="small"/>
                        </template>
                        <span v-else>{{ scope.row.cfgValue }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.edit">
                            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
                            <el-button type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(scope.$index,scope.row)">保存</el-button>
                        </template>
                        <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


    </div>
</template>

<script>
    import querystring from 'querystring'
    export default {
        name: 'BaseConfigTable',
        data() {
            return {
                url: "/sysconfig/queryList",
                tableData: [],
                cfgGroup: ''
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$req.post(this.url, querystring.stringify({cfgGroup: this.cfgGroup})).then((res) => {
                    this.tableData = res.data.data.map(v => {
                        v.edit=false
                        v.originalcfgValue = v.cfgValue
                        return v
                    })
                })
            },
            cancelEdit(row) {
                row.cfgValue = row.originalcfgValue
                row.edit = false
                this.$message({
                    message: '配置值已重置为修改前',
                    type: 'warning'
                })
            },
            handleEdit(row) {
                row.edit = true
                row.originalcfgValue = row.cfgValue
            },
            confirmEdit(index,row) {
                this.$req.post("/sysconfig/saveBaseCfgValue",this.tableData[index])
                    .then((res)=>{
                        if(res.data.rtcd == '0'){
                            row.edit = false
                            row.originalcfgValue = row.cfgValue
                            this.$message({
                                message: '配置值保存成功',
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: '配置值保存失败'+res.data.rtcd+";"+res.data.msg,
                                type: 'error'
                            })
                        }
                    })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
