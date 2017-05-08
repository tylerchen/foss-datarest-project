<template>
    <div>
        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="21">
                <Button type="ghost" icon="refresh" @click="previewListQueryView">预览</Button>&nbsp;&nbsp;
            </Col>
        </Row>

        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="10">
                <Table highlight-row :columns="dataSourceColumns" :data="dataSourceRows" @on-current-change="changeDataSourceSelectedRow"></Table>
            </Col>
            <Col span="10" offset="1">
                <Table highlight-row :columns="queryStatementColumns" :data="queryStatementRows" @on-current-change="changeQueryStatementSelectedRow"></Table>
            </Col>
        </Row>

        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="10">
                <Page :total="dataSourceTotalCount" :page-size="dataSourcePageSize" :current="dataSourceCurrentPage"
                      @on-change="changeDataSourcePage" @on-page-size-change="changeDataSourcePageSize" show-sizer show-total></Page>
            </Col>
            <Col span="10" offset="1">
                <Page :total="queryStatementTotalCount" :page-size="queryStatementPageSize" :current="queryStatementCurrentPage"
                      @on-change="changeQueryStatementPage" @on-page-size-change="changeQueryStatementPageSize" show-sizer show-total></Page>
            </Col>
        </Row>

        <list-query-view-modal-component ref="listqueryviewchild"></list-query-view-modal-component>
    </div>

</template>
<script>
    import { DATA_SOURCE, QUERY_STATEMENT, PAGE } from '../../config/vuex.js';
    import ListQueryViewModalComponent from './listQueryViewModal.vue'

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
                dataSourceCurrentPage: PAGE.INIT_CURRENT_PAGE,
                dataSourcePageSize: PAGE.INIT_PAGE_SIZE,
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
                queryStatementCurrentPage: PAGE.INIT_CURRENT_PAGE,
                queryStatementPageSize: PAGE.INIT_PAGE_SIZE,
                queryStatementTotalCount: 0,
                queryStatementSelectedObj: ''
            }
        },
        mounted () {
            this.getDataSourcePage()
            this.getQueryStatementPage()
        },
        components: {
            'list-query-view-modal-component': ListQueryViewModalComponent
        },
        methods: {
            changeDataSourcePage (current) {
                this.dataSourceSelectedObj = ''
                this.dataSourceCurrentPage = current
                this.getDataSourcePage()
            },
            changeDataSourcePageSize (pageSize) {
                this.dataSourceSelectedObj = ''
                this.dataSourcePageSize = pageSize
                this.getDataSourcePage()
            },
            changeDataSourceSelectedRow (currentRow, oldCurrentRow) {
                this.dataSourceSelectedObj = currentRow
            },
            getDataSourcePage () {
                this.$http.get(DATA_SOURCE.URL.LIST + "/currentPage=" + this.dataSourceCurrentPage + "/pageSize=" + this.dataSourcePageSize)
                        .then((response) => {
                            var resultData = response.data
                            this.$set(this.$data, 'dataSourceRows', resultData.rows)
                            this.$set(this.$data, 'dataSourceTotalCount', resultData.totalCount)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
            },
            changeQueryStatementPage (current) {
                this.queryStatementSelectedObj = ''
                this.queryStatementCurrentPage = current
                this.getQueryStatementPage()
            },
            changeQueryStatementPageSize (pageSize) {
                this.queryStatementSelectedObj = ''
                this.queryStatementPageSize = pageSize
                this.getQueryStatementPage()
            },
            changeQueryStatementSelectedRow (currentRow, oldCurrentRow) {
                this.queryStatementSelectedObj = currentRow
            },
            getQueryStatementPage () {
                this.$http.get(QUERY_STATEMENT.URL.LIST + "/currentPage=" + this.queryStatementCurrentPage + "/pageSize=" + this.queryStatementPageSize)
                    .then((response) => {
                        var resultData = response.data
                        this.$set(this.$data, 'queryStatementRows', resultData.rows)
                        this.$set(this.$data, 'queryStatementTotalCount', resultData.totalCount)
                    })
                    .catch(function(response) {
                        console.log(response)
                    })
            },
            previewListQueryView () {
                this.$refs.listqueryviewchild.show(true, this.dataSourceSelectedObj.name, this.queryStatementSelectedObj.name)
            }
        }
    }
</script>