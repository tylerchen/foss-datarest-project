define([ 'vue', 'html!views/queryView/listDataSourceAndQueryStatement.html', 'globalConst', 'listQueryViewModal' ],
    function(Vue, html, globalConst) {
        const DATA_SOURCE = globalConst.DATA_SOURCE
        const QUERY_STATEMENT = globalConst.QUERY_STATEMENT
        const PAGE = globalConst.PAGE

        return {
            template: html,
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
})