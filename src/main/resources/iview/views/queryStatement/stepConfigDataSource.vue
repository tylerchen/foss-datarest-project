<template>

    <step-state-component :current-state="currentState"></step-state-component>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="2"></i-col>
        <i-col span="20">
           <i-table highlight-row :columns="columns" :data="rows" @on-current-change="changeSelectedRow"></i-table>
        </i-col>
        <i-col span="2"></i-col>
    </Row>

    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="2"></i-col>
        <i-col span="20">
            <Page :total="totalCount" :page-size="pageSize" :current="currentPage"
                  @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </i-col>
        <i-col span="2"></i-col>
    </Row>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="2"></i-col>
        <i-col span="20">
            <i-button type="primary" @click="previous">返回</i-button>
            &nbsp;&nbsp;
            <i-button type="primary" @click="next">下一步</i-button>
        </i-col>
        <i-col span="2"></i-col>
    </Row>
</template>
<script>
    import { DATA_SOURCE as MODULE, QUERY_STATEMENT_CREATE_STORE as STORE } from '../../config/vuex.js';
    import RemoveComponent from '../../components/remove.vue'
    import StepStateComponent from './stepState.vue'

    var INIT_CURRENT_PAGE = 1
    var INIT_PAGE_SIZE = 10

    export default {
        data () {
            return {
                currentState: 0,
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: 'JDBC Driver',
                        key: 'driver'
                    },
                    {
                        title: '用户名',
                        key: 'user'
                    },
                    {
                        title: '密码',
                        key: 'password'
                    },
                    {
                        title: '初始化连接数',
                        key: 'initConnection'
                    },
                    {
                        title: '最大连接数',
                        key: 'maxConnection'
                    },
                    {
                        title: '修改时间',
                        key: 'updateTime'
                    }
                ],
                rows: [],
                currentPage: INIT_CURRENT_PAGE,
                pageSize: INIT_PAGE_SIZE,
                totalCount: 0,
                selectedId: ""
            }
        },
        ready () {
            this.initListData()
        },
        methods: {
            previous () {
                STORE.clear()
                this.$router.go('/query_statement_list')
            },
            next () {
                if(this.selectedId != "") {
                    STORE.dataSourceId = this.selectedId
                    this.$router.go("/step_config_table")
                }
                else {
                    this.$Message.info('请选择记录!')
                }
            },
            initListData () {
                this.$set('currentPage', INIT_CURRENT_PAGE)
                this.$set('pageSize', INIT_PAGE_SIZE)
                this.getDataPage()
            },
            changePage (current) {
                this.$set('currentPage', current)
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.$set('pageSize', pageSize)
                this.getDataPage()
            },
            getDataPage () {
                this.$http.get(MODULE.URL.LIST + "/currentPage=" + this.currentPage + "/pageSize=" + this.pageSize)
                        .then((response) => {
                            this.selectedId = ""
                            var resultData = response.data.rows
                            for(var i in resultData) {
                                if(resultData[i].id == STORE.dataSourceId) {
                                    resultData[i]._highlight = true
                                    this.selectedId = resultData[i].id
                                }
                            }
                            this.$set('rows', resultData)
                            this.$set('totalCount', resultData.totalCount)
                        })
                        .catch(function(response) {
                            console.log(response)
                        })
            },
            changeSelectedRow (currentRow) {
                this.selectedId = currentRow.id
            }
        },
        components: {
            'step-state-component': StepStateComponent,
            'remove-component': RemoveComponent
        }
    }
</script>