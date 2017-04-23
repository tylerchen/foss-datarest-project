<template>

    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <div v-for="searchCondition in searchConditions">
                {{ searchCondition.name }}&nbsp;
                {{ searchCondition.meta }}&nbsp;
                <i-input :value.sync="searchCondition.paramValue" style="width: 300px"></i-input>
                <br>
                <br>
            </div>
        </i-col>
    </Row>

    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <i-button type="ghost" icon="refresh" @click="search">搜索</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="refresh" @click="refresh">刷新</i-button>
        </i-col>
    </Row>

    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="22">
            <i-table :columns="columns" :data="rows"></i-table>
        </i-col>
    </Row>
    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <Page :total="totalCount" :page-size="conditions.pageSize" :current="conditions.currentPage" :page-size-opts="pageSizeOpts"
                  @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </i-col>
    </Row>

</template>
<script>

    export default {
        props: ['dataSourceName', 'queryStatementName', 'customize'],
        data () {
            return {
                columns: [{
                    title: '',
                    key: ''
                }],
                rows: [],
                pageSizeOpts: [10, 20],
                totalCount: 0,
                conditions: {
                    currentPage: 1,
                    pageSize: 10
                },
                searchConditions: []
            }
        },
        ready () {
            if(!this.customize) {
                this.loadSearchConditions()
            }
        },
        methods: {
            refresh () {
                this.searchConditions = _.map(this.searchConditions, function(searchCondition) {
                    searchCondition.paramValue = ""
                    return searchCondition
                })
                this.search()
            },
            changePage (current) {
                this.$set('conditions.currentPage', current)
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.$set('conditions.pageSize', pageSize)
                this.getDataPage()
            },
            loadSearchConditions () {
                axios.get("/default/querystatement_get_name/" + this.queryStatementName).then(function (response) {
                    var resultData = response.data
                    var selectBody = resultData.selectBody
                    var whereBody = resultData.whereBody

                    if(!this.customize) {
                        this.columns = []
                        var selectColumns = selectBody.split(", ")
                        for (var selectColumn in selectColumns) {
                            var key = selectColumns[selectColumn].split(" ")[1]
                            this.columns.push({title: key, key: key})
                        }

                        this.searchConditions = []
                        if(whereBody.length > 2) {
                            whereBody = whereBody.substr(1, whereBody.length - 2)
                            var whereColumns = whereBody.split('][')
                            for(var i in whereColumns) {
                                var whereColumn = whereColumns[i].split(" ")
                                if("AND" == whereColumn[0]) {
                                    this.searchConditions.push({
                                        name: whereColumn[1],
                                        paramName: whereColumn[3].substr(1, whereColumn[3].length-1),
                                        paramValue: ""
                                    })
                                }
                            }
                        }
                    }

                    this.getDataPage()

                }.bind(this)).catch(function(error) {
                    console.log(error)
                })
            },
            getDataPage () {
                axios.post(
                    "/default/query_page/" + this.dataSourceName + "/" + this.queryStatementName,
                    "conditions=" + encodeURIComponent(JSON.stringify(this.conditions))
                ).then(function (response) {
                    var resultData = response.data
                    this.$set('rows', resultData.rows)
                    this.$set('totalCount', resultData.totalCount)
                }.bind(this)).catch(function (error) {
                    console.log(error)
                })
            },
            search () {

                this.conditions = {
                    currentPage: 1,
                    pageSize: this.conditions.pageSize
                }

                for(var i in this.searchConditions) {
                    var searchCondition = this.searchConditions[i]
                    if(searchCondition.paramValue != '') {
                        this.conditions[searchCondition.paramName] = searchCondition.paramValue.trim()
                    }
                }

                this.getDataPage()
            }
        },
        watch: {
            dataSourceName: function () {
                this.loadSearchConditions()
            },
            queryStatementName: function() {
                this.loadSearchConditions()
            }
        },
        events: {
            'customizeData': function (data) {
                if(this.customize) {

                    var columns = data.columns
                    var searchConditions = data.searchConditions
                    var conditions = data.conditions
                    var pageSizeOpts = data.pageSizeOpts

                    if(columns != undefined) {
                        this.$set('columns', columns)
                    }

                    if(searchConditions != undefined) {
                        this.$set('searchConditions', searchConditions)
                    }

                    if(conditions != undefined) {
                        for(var key in conditions) {
                            this.conditions[key] = conditions[key]
                        }
                    }

                    if(pageSizeOpts != undefined) {
                        this.$set('pageSizeOpts', pageSizeOpts)
                    }

                    this.loadSearchConditions()
                }
            }
        }
    }
</script>