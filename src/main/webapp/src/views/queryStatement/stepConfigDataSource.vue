<template>
    <div>
        <step-state-component :current-state="currentState"></step-state-component>

        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="20" offset="2">
               <i-table highlight-row :columns="columns" :data="rows" @on-current-change="changeSelectedRow"></i-table>
            </Col>
        </Row>

        <br>
        <Row type="flex" justify="space-around" align="middle">
            <Col span="20" offset="2">
                <Page :total="totalCount" :page-size="pageSize" :current="currentPage"
                      @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
            </Col>
        </Row>

        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="20" offset="2">
                <Button type="primary" @click="previous">返回</Button>
                &nbsp;&nbsp;
                <Button type="primary" @click="next">下一步</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
    import { QUERY_STATEMENT as MODULE, DATA_SOURCE, QUERY_STATEMENT_CREATE_STORE as STORE, PAGE } from '../../config/vuex.js';
    import StepStateComponent from './stepState.vue'

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
                currentPage: PAGE.INIT_CURRENT_PAGE,
                pageSize: PAGE.INIT_PAGE_SIZE,
                totalCount: 0,
                selectedId: ''
            }
        },
        mounted () {
            this.initListData()
        },
        methods: {
            previous () {
                STORE.clear()
                this.$router.push(MODULE.ROUTER.LIST)
            },
            next () {
                if(this.selectedId != "") {
                    STORE.dataSourceId = this.selectedId
                    this.$router.push(MODULE.ROUTER.STEP_CONFIG_TABLE)
                }
                else {
                    this.$Message.info('请选择记录!')
                }
            },
            initListData () {
                this.currentPage = PAGE.INIT_CURRENT_PAGE
                this.pageSize = PAGE.INIT_PAGE_SIZE
                this.getDataPage()
            },
            changePage (current) {
                this.currentPage = current
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.pageSize = pageSize
                this.getDataPage()
            },
            getDataPage () {
                this.$http.get(DATA_SOURCE.URL.LIST + "/currentPage=" + this.currentPage + "/pageSize=" + this.pageSize)
                        .then((response) => {
                            this.selectedId = ""
                            var resultData = response.data.rows
                            for(var i in resultData) {
                                if(resultData[i].id == STORE.dataSourceId) {
                                    resultData[i]._highlight = true
                                    this.selectedId = resultData[i].id
                                }
                            }
                            this.$set(this.$data, 'rows', resultData)
                            this.$set(this.$data, 'totalCount', resultData.totalCount)
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
            'step-state-component': StepStateComponent
        }
    }
</script>