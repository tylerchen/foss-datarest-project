<template>
    <br />
    <Row type="flex" justify="space-around" align="middle">
        <i-col span="22">
            <i-button type="ghost" icon="android-add" @click="add">添加</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="edit" @click="edit">修改</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="information" @click="view">查看</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="android-remove" @click="remove">删除</i-button>&nbsp;&nbsp;
            <i-button type="ghost" icon="refresh" @click="refresh">刷新</i-button>&nbsp;&nbsp;
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

    <remove-component></remove-component>

</template>
<script>
    import { DATA_SOURCE as MODULE } from '../../config/vuex.js';
    import RemoveComponent from '../../components/remove.vue'

    var ADD_PATH = '/data_source_add'
    var EDIT_PATH = '/data_source_edit'
    var VIEW_PATH = '/data_source_view'
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
                selectedIds: []
            }
        },
        ready () {
            this.initListData()
        },
        methods: {
            add () {
                this.$router.go(ADD_PATH)
            },
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
                    // 通知子组件删除记录
                    var removeUrl = MODULE.URL.REMOVE + "/" +  this.selectedIds[0]
                    this.$broadcast('remove', removeUrl)
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