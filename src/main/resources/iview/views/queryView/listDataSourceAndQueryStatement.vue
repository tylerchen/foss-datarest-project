<template>
    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <i-button type="ghost" icon="refresh" @click="previewListQueryView">预览</i-button>&nbsp;&nbsp;
        </i-col>
    </Row>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="10">
           <i-table highlight-row :columns="dataSourceColumns" :data="dataSourceRows" @on-current-change="changeDataSourceSelectedRow"></i-table>
        </i-col>
        <i-col span="1"></i-col>
        <i-col span="10">
            <i-table highlight-row :columns="queryStatementColumns" :data="queryStatementRows" @on-current-change="changeQueryStatementSelectedRow"></i-table>
        </i-col>
        <i-col span="1"></i-col>
    </Row>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="10">
            <Page :total="dataSourceTotalCount" :page-size="dataSourcePageSize" :current="dataSourceCurrentPage"
                  @on-change="changeDataSourcePage" @on-page-size-change="changeDataSourcePageSize" show-sizer show-total></Page>
        </i-col>
        <i-col span="1"></i-col>
        <i-col span="10">
            <Page :total="queryStatementTotalCount" :page-size="queryStatementPageSize" :current="queryStatementCurrentPage"
                  @on-change="changeQueryStatementPage" @on-page-size-change="changeQueryStatementPageSize" show-sizer show-total></Page>
        </i-col>
        <i-col span="1"></i-col>
    </Row>

    <list-query-view-modal-component :show-modal.sync="showListQueryViewModal" v-ref:listqueryviewchild></list-query-view-modal-component>

</template>
<script>
    import { DATA_SOURCE, QUERY_STATEMENT } from '../../config/vuex.js';
    import ListQueryViewModalComponent from './listQueryViewModal.vue'

    var INIT_CURRENT_PAGE = 1
    var INIT_PAGE_SIZE = 10

    export default {
        data () {
            return {
                dataSourceColumns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    }
                ],
                dataSourceRows: [],
                dataSourceCurrentPage: INIT_CURRENT_PAGE,
                dataSourcePageSize: INIT_PAGE_SIZE,
                dataSourceTotalCount: 0,
                dataSourceSelectedObj: '',
                queryStatementColumns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    }
                ],
                queryStatementRows: [],
                queryStatementCurrentPage: INIT_CURRENT_PAGE,
                queryStatementPageSize: INIT_PAGE_SIZE,
                queryStatementTotalCount: 0,
                queryStatementSelectedObj: '',
                showListQueryViewModal: false
            }
        },
        ready () {
            this.getDataSourcePage()
            this.getQueryStatementPage()
        },
        components: {
            'list-query-view-modal-component': ListQueryViewModalComponent
        },
        methods: {
            changeDataSourcePage (current) {
                this.dataSourceSelectedObj = ''
                this.$set('dataSourceCurrentPage', current)
                this.getDataSourcePage()
            },
            changeDataSourcePageSize (pageSize) {
                this.dataSourceSelectedObj = ''
                this.$set('dataSourcePageSize', pageSize)
                this.getDataSourcePage()
            },
            changeDataSourceSelectedRow (currentRow) {
                this.dataSourceSelectedObj = currentRow
            },
            getDataSourcePage () {
                this.$http.get(DATA_SOURCE.URL.LIST + "/currentPage=" + this.dataSourceCurrentPage + "/pageSize=" + this.dataSourcePageSize)
                        .then((response) => {
                            var resultData = response.data
                            this.$set('dataSourceRows', resultData.rows)
                            this.$set('dataSourceTotalCount', resultData.totalCount)
                        })
                        .catch(function(response) {
                            console.log(response)
                        })
            },
            changeQueryStatementPage (current) {
                this.queryStatementSelectedObj = ''
                this.$set('queryStatementCurrentPage', current)
                this.getQueryStatementPage()
            },
            changeQueryStatementPageSize (pageSize) {
                this.queryStatementSelectedObj = ''
                this.$set('queryStatementPageSize', pageSize)
                this.getQueryStatementPage()
            },
            changeQueryStatementSelectedRow (currentRow) {
                this.queryStatementSelectedObj = currentRow
            },
            getQueryStatementPage () {
                this.$http.get(QUERY_STATEMENT.URL.LIST + "/currentPage=" + this.queryStatementCurrentPage + "/pageSize=" + this.queryStatementPageSize)
                    .then((response) => {
                        var resultData = response.data
                        this.$set('queryStatementRows', resultData.rows)
                        this.$set('queryStatementTotalCount', resultData.totalCount)
                    })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            previewListQueryView () {
                this.$refs.listqueryviewchild.$emit('setData', this.dataSourceSelectedObj.name, this.queryStatementSelectedObj.name)
                this.showListQueryViewModal = true
            }
        }
    }
</script>