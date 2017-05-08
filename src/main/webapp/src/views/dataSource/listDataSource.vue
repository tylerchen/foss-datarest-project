<template>
    <div>
        <br>
        <Row type="flex" justify="space-around" align="middle">
            <Col span="22">
                <Button type="ghost" icon="android-add" @click="add">添加</Button>&nbsp;&nbsp;
                <Button type="ghost" icon="edit" @click="edit">修改</Button>&nbsp;&nbsp;
                <Button type="ghost" icon="information" @click="view">查看</Button>&nbsp;&nbsp;
                <Button type="ghost" icon="android-remove" @click="remove">删除</Button>&nbsp;&nbsp;
                <Button type="ghost" icon="refresh" @click="initListData">刷新</Button>&nbsp;&nbsp;
            </Col>
        </Row>

        <br>
        <Row type="flex" justify="center" align="middle">
            <Col span="22">
               <Table :columns="columns" :data="rows" @on-selection-change="changeSelectedRow"></Table>
            </Col>
        </Row>

        <br>
        <Row type="flex" justify="space-around" align="middle">
            <Col span="22">
                <Page :total="totalCount" :page-size="pageSize" :current="currentPage"
                      @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total></Page>
            </Col>
        </Row>

        <remove-component v-on:refresh="initListData" ref="removechild"></remove-component>
    </div>
</template>
<script>
    import { DATA_SOURCE as MODULE, PAGE } from '../../config/vuex.js';
    import RemoveComponent from '../../remove.vue'

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
                currentPage: PAGE.INIT_CURRENT_PAGE,
                pageSize: PAGE.INIT_PAGE_SIZE,
                totalCount: 0,
                selectedIds: []
            }
        },
        mounted () {
            this.initListData()
        },
        methods: {
            add () {
                this.$router.push(MODULE.ROUTER.ADD)
            },
            edit () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.push(MODULE.ROUTER.EDIT + "/" +  this.selectedIds[0])
                }
            },
            view () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$router.push(MODULE.ROUTER.VIEW + "/" + this.selectedIds[0])
                }
            },
            remove () {
                if(this.checkSelectedOnlyOne(this.selectedIds)) {
                    this.$refs.removechild.remove(MODULE.URL.REMOVE + "/" +  this.selectedIds[0])
                }
            },
            initListData () {
                this.selectedIds = []
                this.currentPage = PAGE.INIT_CURRENT_PAGE
                this.pageSize = PAGE.INIT_PAGE_SIZE
                this.getDataPage()
            },
            changePage (current) {
                this.selectedIds = []
                this.currentPage = current
                this.getDataPage()
            },
            changePageSize (pageSize) {
                this.selectedIds = []
                this.pageSize = pageSize
                this.getDataPage()
            },
            getDataPage () {
                var url = MODULE.URL.LIST + "/currentPage=" + this.currentPage + "/pageSize=" + this.pageSize
                this.$http.get(url)
                    .then((response) => {

                        var resultData = response.data
                        this.$set(this.$data, 'rows', resultData.rows)
                        this.$set(this.$data, 'totalCount', resultData.totalCount)

                    })
                    .catch((error) => {
                        console.log(error)
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
        }
    }
</script>