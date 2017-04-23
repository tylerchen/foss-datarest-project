<template>
    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <i-button type="ghost" icon="android-add" @click="openDataSources">添加</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="edit" @click="edit">修改</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="information" @click="view">查看</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="android-remove" @click="remove">删除</i-button>&nbsp;&nbsp;

        </i-col>
    </Row>
    <br />
    <Row type="flex" justify="center" align="middle">
        <i-col span="22">
            <i-table :columns="columns" :data="rows" @on-selection-change="changeSelectedRow"></i-table>
        </i-col>
    </Row>
    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <Page :total="totalCount" :page-size="pageSize" :current="currentPage"
                  @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
        </i-col>
    </Row>

    <remove-component v-ref:removechild></remove-component>

</template>
<script>
    import { QUERY_STATEMENT as MODULE} from '../../config/vuex.js';
    import RemoveComponent from '../../components/remove.vue'

    var EDIT_PATH = '/query_statement_edit'
    var VIEW_PATH = '/query_statement_view'
    var INIT_CURRENT_PAGE = 1
    var INIT_PAGE_SIZE = 10

    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '显示字段',
                        key: 'selectBody'
                    },
                    {
                        title: '数据表',
                        key: 'fromBody'
                    },
                    {
                        title: '查询条件',
                        key: 'whereBody'
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
                selectedIds: []
            }
        },
        ready () {
            this.initListData()
        },
        methods: {
            edit () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.go(EDIT_PATH + "/" +  this.selectedIds[0])
                }
            },
            view () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.go(VIEW_PATH + "/" + this.selectedIds[0])
                }
            },
            remove () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    var removeUrl = MODULE.URL.REMOVE + "/" +  this.selectedIds[0]
                    this.$refs.removechild.$emit('remove', removeUrl)
                }
            },
            refresh () {
                this.initListData()
            },
            initListData () {
                this.selectedIds = []
                this.$set('currentPage', INIT_CURRENT_PAGE)
                this.$set('pageSize', INIT_PAGE_SIZE)
                this.getDataPage()
            },
            changePage (current) {
                this.selectedIds = []
                this.$set('currentPage', current)
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.selectedIds = []
                this.$set('pageSize', pageSize)
                this.getDataPage()
            },
            getDataPage () {
                this.$http.get(MODULE.URL.LIST + "/currentPage=" + this.currentPage + "/pageSize=" + this.pageSize)
                        .then((response) => {
                            console.log(response.data)
                            var resultData = response.data
                            this.$set('rows', resultData.rows)
                            this.$set('totalCount', resultData.totalCount)
                        })
                        .catch(function(response) {
                            console.log(response)
                        })
            },
            checkSelectedOnlyOne (selectedIds) {
                if(selectedIds.length != 1) {
                    this.$Message.info('请选择一条记录!')
                    return false
                }
                return true
            },
            changeSelectedRow (selection) {
                this.selectedIds = []
                for(var i=0; i<selection.length; i++) {
                    this.selectedIds.push(selection[i].id)
                }
            },
            openDataSources () {
                this.$router.go('/step_config_data_source')
            }
        },
        components: {
            'remove-component': RemoveComponent
        },
        events: {
            'refresh-list': function () {
                this.initListData()
            }
        }
    }
</script>